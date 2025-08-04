"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./Chat.css"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat/history")
      setChatHistory(response.data)

      // Convert history to messages format
      const historyMessages = response.data.flatMap((chat) => [
        { type: "user", content: chat.message, timestamp: chat.timestamp },
        { type: "ai", content: chat.response, timestamp: chat.timestamp },
      ])

      setMessages(historyMessages)
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/chat/cricket-chat", {
        message: inputMessage,
      })

      const aiMessage = {
        type: "ai",
        content: response.data.response,
        timestamp: response.data.timestamp,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      setInputMessage("")
    }
  }

  const clearChat = async () => {
    try {
      await axios.delete("http://localhost:5000/api/chat/history")
      setMessages([])
      setChatHistory([])
    } catch (error) {
      console.error("Error clearing chat:", error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestedQuestions = [
    "Who is the highest run scorer in ODI cricket?",
    "Tell me about Virat Kohli's career statistics",
    "What are the rules of T20 cricket?",
    "Who won the last Cricket World Cup?",
    "Compare MS Dhoni and Rishabh Pant as wicket-keepers",
    "What is the highest team score in Test cricket?",
  ]

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 Cricket AI Assistant</h2>
        <button onClick={clearChat} className="clear-chat-btn">
          Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>Welcome to Cricket AI Chat! 🏏</h3>
            <p>Ask me anything about cricket - player stats, match history, rules, or current events!</p>

            <div className="suggested-questions">
              <h4>Try asking:</h4>
              {suggestedQuestions.map((question, index) => (
                <button key={index} className="suggestion-btn" onClick={() => setInputMessage(question)}>
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about cricket..."
          rows="3"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !inputMessage.trim()} className="send-btn">
          {loading ? "⏳" : "📤"}
        </button>
      </div>
    </div>
  )
}

export default Chat
