"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Quiz.css"

const Quiz = () => {
  const [selectedCategory, setSelectedCategory] = useState("indian")
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [quizHistory, setQuizHistory] = useState([])

  const categories = [
    { id: "indian", name: "Indian Cricket", icon: "🇮🇳" },
    { id: "international", name: "International Cricket", icon: "🌍" },
    { id: "history", name: "Cricket History", icon: "📚" },
    { id: "records", name: "Cricket Records", icon: "🏆" },
  ]

  useEffect(() => {
    fetchQuizHistory()
  }, [])

  const fetchQuizHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quiz/history/user")
      setQuizHistory(response.data.data || [])
    } catch (error) {
      console.error("Error fetching quiz history:", error)
    }
  }

  const startQuiz = async (category) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/quiz/${category}?limit=10`)
      setQuestions(response.data.data || [])
      setSelectedCategory(category)
      setCurrentQuestion(0)
      setSelectedAnswers({})
      setShowResults(false)
      setResults(null)
    } catch (error) {
      console.error("Error fetching quiz questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = async () => {
    setLoading(true)
    try {
      const answers = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: selectedAnswers[q._id] || 0,
      }))

      const response = await axios.post("http://localhost:5000/api/quiz/submit", {
        answers,
        category: selectedCategory,
      })

      setResults(response.data.data)
      setShowResults(true)
      fetchQuizHistory() // Refresh history
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetQuiz = () => {
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setResults(null)
  }

  if (loading) {
    return <div className="loading">Loading quiz...</div>
  }

  if (showResults && results) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <div className="score-summary">
            <div className="score-circle">
              <span className="score">{results.score}</span>
              <span className="total">/{results.totalQuestions}</span>
            </div>
            <div className="percentage">{results.percentage}%</div>
          </div>

          <div className="results-details">
            {results.results.map((result, index) => (
              <div key={index} className={`result-item ${result.isCorrect ? "correct" : "incorrect"}`}>
                <h4>
                  Q{index + 1}: {result.question}
                </h4>
                <p className="selected-answer">
                  Your answer: {questions[index]?.options[result.selectedAnswer]}
                  {result.isCorrect ? " ✅" : " ❌"}
                </p>
                {!result.isCorrect && (
                  <p className="correct-answer">Correct answer: {questions[index]?.options[result.correctAnswer]}</p>
                )}
                {result.explanation && <p className="explanation">{result.explanation}</p>}
              </div>
            ))}
          </div>

          <div className="quiz-actions">
            <button onClick={resetQuiz} className="btn-primary">
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length > 0) {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Cricket Quiz - {categories.find((c) => c.id === selectedCategory)?.name}</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="quiz-question">
          <h3>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswers[question._id] === index ? "selected" : ""}`}
                onClick={() => handleAnswerSelect(question._id, index)}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button onClick={prevQuestion} disabled={currentQuestion === 0} className="btn-secondary">
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className="btn-primary"
            >
              Submit Quiz
            </button>
          ) : (
            <button onClick={nextQuestion} className="btn-primary">
              Next
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="quiz-home">
        <h1>Cricket Knowledge Quiz</h1>
        <p>Test your cricket knowledge across different categories</p>

        <div className="quiz-categories">
          {categories.map((category) => (
            <div key={category.id} className="category-card" onClick={() => startQuiz(category.id)}>
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>10 Questions</p>
              <button className="start-btn">Start Quiz</button>
            </div>
          ))}
        </div>

        {quizHistory.length > 0 && (
          <div className="quiz-history">
            <h3>Your Quiz History</h3>
            <div className="history-list">
              {quizHistory.slice(0, 5).map((quiz, index) => (
                <div key={index} className="history-item">
                  <span className="category">{quiz.category}</span>
                  <span className="score">
                    {quiz.score}/{quiz.totalQuestions}
                  </span>
                  <span className="percentage">{Math.round((quiz.score / quiz.totalQuestions) * 100)}%</span>
                  <span className="date">{new Date(quiz.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
