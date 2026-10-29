
import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";

const topics = [
  { id: "C", name: "C Programming", description: "Basics, loops, pointers and memory" },
  { id: "C++", name: "C++", description: "OOP, STL, pointers and inheritance" },
  { id: "Java", name: "Java", description: "OOP, collections and exception handling" },
  { id: "Python", name: "Python", description: "Syntax, data structures and functions" },
  { id: "JavaScript", name: "JavaScript", description: "ES6, arrays, objects and async programming" },
  { id: "HTML", name: "HTML", description: "Elements, forms, semantic tags and accessibility" },
  { id: "CSS", name: "CSS", description: "Flexbox, Grid, responsive design and animations" },
  { id: "Web Development", name: "Web Development", description: "Frontend, backend, APIs and full-stack concepts" },
  { id: "React", name: "React", description: "Components, props, hooks and state" },
  { id: "Node.js", name: "Node.js & Express", description: "Servers, middleware, routes and REST APIs" },
  { id: "DBMS", name: "DBMS & SQL", description: "Queries, joins, keys and normalization" },
  { id: "DSA", name: "Data Structures & Algorithms", description: "Arrays, trees, sorting and complexity" },
  { id: "OOP", name: "Object-Oriented Programming", description: "Encapsulation, inheritance and polymorphism" },
  { id: "Operating Systems", name: "Operating Systems", description: "Processes, threads, scheduling and memory" },
  { id: "Computer Networks", name: "Computer Networks", description: "TCP/IP, HTTP, DNS and networking basics" },
  { id: "AI", name: "Artificial Intelligence", description: "Search, reasoning and intelligent agents" },
  { id: "Machine Learning", name: "Machine Learning", description: "Supervised learning, models and evaluation" },
  { id: "Deep Learning", name: "Deep Learning", description: "Neural networks and deep learning basics" },
  { id: "Cybersecurity", name: "Cybersecurity", description: "Encryption, authentication and common attacks" },
  { id: "Git & GitHub", name: "Git & GitHub", description: "Commits, branches, merging and collaboration" },
  { id: "Cloud Computing", name: "Cloud Computing", description: "Cloud services, deployment and virtualization" },
  { id: "Software Engineering", name: "Software Engineering", description: "SDLC, testing, design and agile methods" },
];

function MockTest() {
  const [topic, setTopic] = useState("Python");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startTest() {
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setScore(null);

    try {
      const response = await fetch(
        `http://localhost:4000/api/mock-tests/${encodeURIComponent(topic)}/questions`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load questions.");
      }

    setQuestions(data.questions.slice(0, 5));
      setStarted(true);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Could not connect to the backend. Make sure it is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [questions[currentQuestion].id]: optionIndex,
    }));
  }

  async function submitTest() {
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/mock-tests/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
  topic,
  questionIds: questions.map((question) => question.id),
  answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
    questionId: Number(questionId),
    selectedOption,
  })),
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not submit the test.");
      }

      setScore(data);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "The submit endpoint is not ready yet. We will add it next."
          : err.message
      );
    }
  }

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

          <div className="mock-topic-grid">
            {topics.filter((item) => item.id === "Python").map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mock-topic-card ${topic === item.id ? "selected" : ""}`}
                onClick={() => setTopic(item.id)}
                disabled={loading}
              >
                <strong>{item.name}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>

          <p>Multiple choice · View your results after submission</p>
          <button
            className="btn btn-primary"
            onClick={startTest}
            disabled={loading}
          >
            {loading ? "Loading questions..." : "Start test"}
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
                        key={option}
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

              <div className="mock-test-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setCurrentQuestion((n) => n - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentQuestion((n) => n + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitTest}
                  >
                    Submit test
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Test submitted!</h2>
              <p>
                Your score: <strong>{score.score} / {score.totalQuestions}</strong>
              </p>
              <p>Correct answers: {score.correctAnswers}</p>
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