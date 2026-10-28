
const express = require("express");
const mockQuestions = require("./mockQuestions");

const router = express.Router();

// Get available topics
router.get("/topics", (req, res) => {
  res.json(
    Object.keys(mockQuestions).map((topic) => ({
      id: topic,
      name: topic,
      questionCount: mockQuestions[topic].length,
    }))
  );
});

// Get questions without revealing answers
router.get("/:topic/questions", (req, res) => {
  const topic = req.params.topic;
  const questions = mockQuestions[topic];

  if (!questions) {
    return res.status(404).json({ error: "Topic not found." });
  }

  const safeQuestions = questions.map((item, index) => ({
    id: index + 1,
    question: item.question,
    options: item.options,
  }));

  res.json({
    topic,
    totalQuestions: safeQuestions.length,
    questions: safeQuestions,
  });
});

module.exports = router;

router.post("/submit", (req, res) => {
  const { topic, answers } = req.body;
  const questions = mockQuestions[topic];

  if (!questions) {
    return res.status(404).json({
      error: "Topic not found."
    });
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({
      error: "Please provide answers as an object."
    });
  }

  let score = 0;

  const results = questions.map((item, index) => {
    const questionId = String(index + 1);
    const selectedAnswer = answers[questionId];
    const isCorrect = selectedAnswer === item.correctAnswer;

    if (isCorrect) {
      score++;
    }

    return {
      questionId: index + 1,
      selectedAnswer: selectedAnswer ?? null,
      correctAnswer: item.correctAnswer,
      isCorrect,
      explanation: item.explanation
    };
  });

  res.json({
    topic,
    totalQuestions: questions.length,
    score,
    percentage: Math.round((score / questions.length) * 100),
    results
  });
});
