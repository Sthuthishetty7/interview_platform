
const express = require("express");
const mockQuestions = require("../data/mockQuestions");

const router = express.Router();

// Get available topics.
router.get("/topics", (req, res) => {
  res.json(
    Object.keys(mockQuestions).map((topic) => ({
      id: topic,
      name: topic,
      questionCount: mockQuestions[topic].length,
    }))
  );
});

// Get questions without revealing correct answers.
router.get("/:topic/questions", (req, res) => {
  const questions = mockQuestions[req.params.topic];

  if (!questions) {
    return res.status(404).json({ error: "Topic not found." });
  }

  res.json({
    topic: req.params.topic,
    totalQuestions: questions.length,
    questions: questions.map((item, index) => ({
      id: index + 1,
      question: item.question,
      options: item.options,
    })),
  });
});

// Submit answers and calculate the score.
router.post("/submit", (req, res) => {
  const { topic, answers, questionIds } = req.body;
  const questions = mockQuestions[topic];

  if (!questions) {
    return res.status(404).json({ error: "Topic not found." });
  }

  if (!Array.isArray(answers) || !Array.isArray(questionIds)) {
    return res.status(400).json({
      error: "Answers and question IDs must be provided.",
    });
  }

  const selectedAnswers = new Map(
    answers.map((answer) => [
      Number(answer.questionId),
      Number(answer.selectedOption),
    ])
  );

  let correctAnswers = 0;

  for (const id of questionIds) {
    const question = questions[Number(id) - 1];

    if (!question) {
      return res.status(400).json({
        error: `Invalid question ID: ${id}`,
      });
    }

    if (selectedAnswers.get(Number(id)) === question.correctAnswer) {
      correctAnswers++;
    }
  }

  res.json({
    score: correctAnswers,
    totalQuestions: questionIds.length,
    correctAnswers,
  });
});

module.exports = router;
