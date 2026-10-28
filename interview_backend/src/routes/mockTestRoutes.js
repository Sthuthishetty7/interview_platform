
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

// Get questions without revealing the answers.
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

