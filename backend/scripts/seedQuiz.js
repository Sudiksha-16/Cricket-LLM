const mongoose = require("mongoose")
const Quiz = require("../models/Quiz")
require("dotenv").config()

const quizQuestions = [
  {
    question: "Who holds the record for the highest individual score in Test cricket?",
    options: ["Brian Lara", "Matthew Hayden", "Virender Sehwag", "Chris Gayle"],
    correctAnswer: 0,
    category: "records",
    difficulty: "medium",
    explanation:
      "Brian Lara scored 400* against England in 2004, which remains the highest individual score in Test cricket.",
  },
  {
    question: "Which country won the first Cricket World Cup in 1975?",
    options: ["Australia", "West Indies", "England", "India"],
    correctAnswer: 1,
    category: "history",
    difficulty: "easy",
    explanation: "The West Indies defeated Australia in the final at Lord's to win the inaugural Cricket World Cup.",
  },
  {
    question: "What does LBW stand for in cricket?",
    options: ["Leg Before Wicket", "Left Behind Wicket", "Last Ball Win", "Long Boundary Wall"],
    correctAnswer: 0,
    category: "international",
    difficulty: "easy",
    explanation: "LBW stands for Leg Before Wicket, a method of dismissal in cricket.",
  },
  {
    question: "Who is known as 'Captain Cool' in cricket?",
    options: ["Virat Kohli", "MS Dhoni", "Rohit Sharma", "Sourav Ganguly"],
    correctAnswer: 1,
    category: "indian",
    difficulty: "easy",
    explanation: "MS Dhoni is famously known as 'Captain Cool' for his calm demeanor under pressure.",
  },
  {
    question: "In which year did India win their first Cricket World Cup?",
    options: ["1975", "1979", "1983", "1987"],
    correctAnswer: 2,
    category: "indian",
    difficulty: "medium",
    explanation: "India won their first Cricket World Cup in 1983 under Kapil Dev's captaincy.",
  },
  {
    question: "What is the maximum number of overs in a T20 match per team?",
    options: ["15", "20", "25", "30"],
    correctAnswer: 1,
    category: "international",
    difficulty: "easy",
    explanation: "In T20 cricket, each team faces a maximum of 20 overs.",
  },
  {
    question: "Which ground is known as the 'Home of Cricket'?",
    options: ["The Oval", "Lord's", "Old Trafford", "Edgbaston"],
    correctAnswer: 1,
    category: "history",
    difficulty: "medium",
    explanation: "Lord's Cricket Ground in London is traditionally known as the 'Home of Cricket'.",
  },
  {
    question: "Who scored the fastest century in ODI cricket?",
    options: ["AB de Villiers", "Corey Anderson", "Shahid Afridi", "Chris Gayle"],
    correctAnswer: 0,
    category: "records",
    difficulty: "hard",
    explanation: "AB de Villiers scored the fastest ODI century off just 31 balls against the West Indies in 2015.",
  },
  {
    question: "How many players are there in a cricket team on the field?",
    options: ["10", "11", "12", "9"],
    correctAnswer: 1,
    category: "international",
    difficulty: "easy",
    explanation: "A cricket team has 11 players on the field at any given time.",
  },
  {
    question: "Which bowler has taken the most wickets in Test cricket?",
    options: ["Shane Warne", "Muttiah Muralitharan", "Anil Kumble", "James Anderson"],
    correctAnswer: 1,
    category: "records",
    difficulty: "medium",
    explanation: "Muttiah Muralitharan holds the record with 800 Test wickets.",
  },
]

const seedQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing quiz questions
    await Quiz.deleteMany({})
    console.log("Cleared existing quiz questions")

    // Insert new quiz questions
    await Quiz.insertMany(quizQuestions)
    console.log("Quiz questions seeded successfully")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding quiz:", error)
    process.exit(1)
  }
}

seedQuiz()
