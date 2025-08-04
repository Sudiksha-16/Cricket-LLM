const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["indian", "international", "history", "records"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    explanation: String,
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Quiz", quizSchema)
