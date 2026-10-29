
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

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({
      error: "Please provide answers as an object.",
    });
  }

  const ids = Array.isArray(questionIds)
    ? questionIds.map(Number)
    : Object.keys(answers).map(Number);

  if (ids.length === 0 || ids.some((id) => !Number.isInteger(id) || id < 1)) {
    return res.status(400).json({
      error: "Please provide valid question IDs.",
    });
  }

  let correctAnswers = 0;

  for (const id of ids) {
    const question = questions[id - 1];

    if (!question) {
      return res.status(400).json({
        error: `Invalid question ID: ${id}`,
      });
    }

    const selectedOption = Number(answers[String(id)]);

    if (
      Object.prototype.hasOwnProperty.call(answers, String(id)) &&
      Number.isInteger(selectedOption) &&
      selectedOption === question.correctAnswer
    ) {
      correctAnswers++;
    }
  }

  res.json({
    score: correctAnswers,
    totalQuestions: ids.length,
    correctAnswers,
  });
});


module.exports = router;
