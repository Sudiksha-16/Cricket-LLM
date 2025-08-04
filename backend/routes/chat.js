const express = require("express")
const huggingFaceService = require("../services/huggingface")
const auth = require("../middleware/auth")
const User = require("../models/User")

const router = express.Router()

// Cricket LLM Chat using Hugging Face
router.post("/cricket-chat", auth, async (req, res) => {
  try {
    const { message } = req.body
    const userId = req.userId

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" })
    }

    // Generate response using Hugging Face
    const response = await huggingFaceService.generateCricketResponse(message)

    // Save chat history
    await User.findByIdAndUpdate(userId, {
      $push: {
        chatHistory: {
          message,
          response,
          timestamp: new Date(),
        },
      },
    })

    res.json({
      response,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Chat error:", error)
    res.status(500).json({
      message: "Error generating response",
      error: error.message,
    })
  }
})

// Get chat history
router.get("/history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("chatHistory")
    res.json(user.chatHistory || [])
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history" })
  }
})

// Clear chat history
router.delete("/history", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $set: { chatHistory: [] },
    })
    res.json({ message: "Chat history cleared" })
  } catch (error) {
    res.status(500).json({ message: "Error clearing chat history" })
  }
})

// Get cricket insights using AI
router.post("/cricket-insights", auth, async (req, res) => {
  try {
    const { topic } = req.body
    const insights = await huggingFaceService.generateCricketResponse(
      `Provide detailed insights about ${topic} in cricket`,
    )

    res.json({ insights })
  } catch (error) {
    res.status(500).json({ message: "Error generating insights" })
  }
})

module.exports = router
