
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
    return res.status(404).json({
      error: "Topic not found.",
    });
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

// Submit answers and calculate score
router.post("/submit", (req, res) => {
  const { topic, answers } = req.body || {};

  // Check whether topic exists
  if (typeof topic !== "string" || !mockQuestions[topic]) {
    return res.status(404).json({
      error: "Topic not found.",
    });
  }

  const questions = mockQuestions[topic];

  // Check answers format
  if (
    !answers ||
    typeof answers !== "object" ||
    Array.isArray(answers)
  ) {
    return res.status(400).json({
      error: "Please provide answers as an object.",
    });
  }

  // Validate question IDs and selected options
  for (const [questionId, selectedAnswer] of Object.entries(answers)) {
    const id = Number(questionId);

    if (
      !Number.isInteger(id) ||
      id < 1 ||
      id > questions.length
    ) {
      return res.status(400).json({
        error: `Invalid question ID: ${questionId}`,
      });
    }

    if (
      !Number.isInteger(selectedAnswer) ||
      selectedAnswer < 0 ||
      selectedAnswer >= questions[id - 1].options.length
    ) {
      return res.status(400).json({
        error: `Invalid option for question ${questionId}.`,
      });
    }
  }

  let score = 0;

  const results = questions.map((item, index) => {
    const questionId = String(index + 1);
    const selectedAnswer = answers[questionId] ?? null;

    const isCorrect =
      selectedAnswer !== null &&
      selectedAnswer === item.correctAnswer;

    if (isCorrect) {
      score++;
    }

    return {
      questionId: index + 1,
      selectedAnswer,
      correctAnswer: item.correctAnswer,
      isCorrect,
      explanation: item.explanation,
    };
  });

  res.json({
    topic,
    totalQuestions: questions.length,
    score,
    percentage: Math.round(
      (score / questions.length) * 100
    ),
    results,
  });
});

module.exports = router;
