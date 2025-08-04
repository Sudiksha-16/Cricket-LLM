const express = require("express")
const Quiz = require("../models/Quiz")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Get quiz questions by category
router.get("/:category", auth, async (req, res) => {
  try {
    const { category } = req.params
    const limit = Number.parseInt(req.query.limit) || 10

    const questions = await Quiz.aggregate([{ $match: { category } }, { $sample: { size: limit } }])

    // Remove correct answers from response
    const questionsWithoutAnswers = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
    }))

    res.json({
      status: "success",
      data: questionsWithoutAnswers,
      count: questionsWithoutAnswers.length,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz questions" })
  }
})

// Submit quiz answers
router.post("/submit", auth, async (req, res) => {
  try {
    const { answers, category } = req.body // answers: [{ questionId, selectedAnswer }]
    const userId = req.userId

    let score = 0
    const results = []

    for (const answer of answers) {
      const question = await Quiz.findById(answer.questionId)
      const isCorrect = question.correctAnswer === answer.selectedAnswer

      if (isCorrect) score++

      results.push({
        questionId: answer.questionId,
        question: question.question,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      })
    }

    // Save quiz score
    await User.findByIdAndUpdate(userId, {
      $push: {
        quizScores: {
          score,
          totalQuestions: answers.length,
          category,
          date: new Date(),
        },
      },
    })

    res.json({
      status: "success",
      data: {
        score,
        totalQuestions: answers.length,
        percentage: Math.round((score / answers.length) * 100),
        results,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz" })
  }
})

// Get user quiz history
router.get("/history/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("quizScores")
    res.json({
      status: "success",
      data: user.quizScores || [],
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz history" })
  }
})

module.exports = router
