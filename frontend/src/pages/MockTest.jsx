
import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { apiRequest } from "../utils/api";

const topicDescriptions = {
  Python: "Python basics, syntax and functions",
  Java: "OOP, collections and exception handling",
  "C Programming": "Basics, loops, pointers and memory",
  DBMS: "Database concepts, SQL and normalization",
  "Data Structures": "Arrays, trees, stacks and queues",
  "Operating Systems": "Processes, threads and memory management",
};

function MockTest() {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all available topics from backend
  useEffect(() => {
    async function loadTopics() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/api/mock-tests/topics");

        setTopics(data);

        if (data.length > 0) {
          setTopic(data[0].id);
        }
      } catch (err) {
        setError(err.message || "Could not load topics.");
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  // Fetch questions for selected topic
  async function startTest() {
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setScore(null);

    try {
      const data = await apiRequest(
        `/api/mock-tests/${encodeURIComponent(topic)}/questions`
      );

      setQuestions(data.questions);
      setStarted(true);
    } catch (err) {
      setError(err.message || "Could not load questions.");
    } finally {
      setLoading(false);
    }
  }

  // Store selected answer
  function selectAnswer(optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [questions[currentQuestion].id]: optionIndex,
    }));
  }

  // Submit answers to backend
  async function submitTest() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/mock-tests/submit", {
        method: "POST",
        body: JSON.stringify({
          topic,
          answers,
        }),
      });

      setScore(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not submit the test.");
    } finally {
      setLoading(false);
    }
  }

  // Return to topic selection
  function backToTopics() {
    setStarted(false);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setScore(null);
    setError("");
  }

  const question = questions[currentQuestion];

  return (
    <AppLayout>
      <div className="page-head">
        <h1>Mock Test</h1>
        <p className="page-sub">
          Practise technical MCQs and test your knowledge.
        </p>
      </div>

      {error && (
        <p role="alert" className="mock-test-error">
          {error}
        </p>
      )}

      {!started ? (
        <section className="mock-test-panel">
          <h2>Choose your topic</h2>
          <p>Select a subject to practise.</p>

          {loading && <p>Loading topics...</p>}

          <div className="mock-topic-grid">
            {topics.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mock-topic-card ${
                  topic === item.id ? "selected" : ""
                }`}
                onClick={() => setTopic(item.id)}
                disabled={loading}
              >
                <strong>{item.name}</strong>
                <span>
                  {topicDescriptions[item.id] || "Practise technical questions"}
                </span>
                <span>{item.questionCount} questions</span>
              </button>
            ))}
          </div>

          <p>Multiple choice · View your results after submission</p>

          <button
            className="btn btn-primary"
            onClick={startTest}
            disabled={loading || !topic}
          >
            {loading ? "Loading..." : "Start test"}
          </button>
        </section>
      ) : (
        <section className="mock-test-panel">
          {!submitted ? (
            <>
              <h2>{topic} Mock Test</h2>

              <p>
                Question {currentQuestion + 1} of {questions.length}
              </p>

              {question && (
                <div className="mock-question">
                  <h3>{question.question}</h3>

                  <div className="mock-options">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`mock-option ${
                          answers[question.id] === index ? "selected" : ""
                        }`}
                        onClick={() => selectAnswer(index)}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p>
                Answered: {Object.keys(answers).length} / {questions.length}
              </p>

              <div className="mock-test-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setCurrentQuestion((n) => n - 1)
                  }
                  disabled={currentQuestion === 0 || loading}
                >
                  Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      setCurrentQuestion((n) => n + 1)
                    }
                    disabled={loading}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitTest}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit test"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Test Results</h2>

              <p>
                Your score:{" "}
                <strong>
                  {score.score} / {score.totalQuestions}
                </strong>
              </p>

              <p>
                Percentage: <strong>{score.percentage}%</strong>
              </p>

              <p>
                Correct answers:{" "}
                <strong>{score.score}</strong>
              </p>

              <p>
                Incorrect or unanswered:{" "}
                <strong>
                  {score.totalQuestions - score.score}
                </strong>
              </p>

              <h3>Review your answers</h3>

              {score.results.map((result) => {
                const originalQuestion = questions.find(
                  (q) => q.id === result.questionId
                );

                return (
                  <div
                    key={result.questionId}
                    className="mock-question"
                  >
                    <h3>
                      {result.questionId}.{" "}
                      {originalQuestion?.question}
                    </h3>

                    <p>
                      Your answer:{" "}
                      {result.selectedAnswer === null
                        ? "Not answered"
                        : originalQuestion?.options[result.selectedAnswer]}
                    </p>

                    <p>
                      Correct answer:{" "}
                      <strong>
                        {originalQuestion?.options[result.correctAnswer]}
                      </strong>
                    </p>

                    <p>
                      Result:{" "}
                      <strong>
                        {result.isCorrect ? "Correct" : "Incorrect"}
                      </strong>
                    </p>

                    <p>
                      Explanation: {result.explanation}
                    </p>
                  </div>
                );
              })}

              <button
                type="button"
                className="btn btn-primary"
                onClick={backToTopics}
              >
                Back to topics
              </button>
            </>
          )}

          {!submitted && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={backToTopics}
              disabled={loading}
            >
              Exit test
            </button>
          )}
        </section>
      )}
    </AppLayout>
  );
}

export default MockTest;
