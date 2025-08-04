"use client"

import { useState } from "react"
import "./Support.css"

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState("")

  const faqs = [
    {
      question: "How do I use the AI Cricket Chat?",
      answer:
        "Simply go to the Chat page and ask any cricket-related question. Our AI assistant can help with player statistics, match information, cricket rules, and historical data.",
    },
    {
      question: "How accurate is the cricket data?",
      answer:
        "We scrape data from reliable sources like Cricbuzz and ESPNCricinfo. The data is updated regularly, but there might be slight delays during live matches.",
    },
    {
      question: "Can I take the quiz multiple times?",
      answer:
        "Yes! You can take quizzes in different categories as many times as you want. Your scores are saved in your quiz history.",
    },
    {
      question: "Why is the AI response slow sometimes?",
      answer:
        "We use free AI services which have rate limits. During peak usage, responses might be slower. Please be patient and try again if needed.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Currently, password reset is not available. Please contact support if you need help accessing your account.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use industry-standard security practices. Your passwords are encrypted, and we don't share your personal information with third parties.",
    },
  ]

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // Mock form submission
    setSubmitStatus("success")
    setContactForm({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setSubmitStatus(""), 3000)
  }

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Help & Support</h1>
        <p>Get help with using the Cricket LLM app</p>
      </div>

      <div className="support-tabs">
        <button className={`tab-btn ${activeTab === "faq" ? "active" : ""}`} onClick={() => setActiveTab("faq")}>
          ❓ FAQ
        </button>
        <button
          className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
        >
          📧 Contact Us
        </button>
        <button
          className={`tab-btn ${activeTab === "features" ? "active" : ""}`}
          onClick={() => setActiveTab("features")}
        >
          🚀 Features
        </button>
      </div>

      <div className="support-content">
        {activeTab === "faq" && (
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="contact-section">
            <h2>Contact Support</h2>
            <p>Have a question or need help? Send us a message and we'll get back to you.</p>

            {submitStatus === "success" && (
              <div className="success-message">Thank you! Your message has been sent successfully.</div>
            )}

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" value={contactForm.subject} onChange={handleInputChange} required>
                  <option value="">Select a subject</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Help</option>
                  <option value="general">General Question</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  placeholder="Describe your issue or question in detail..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        )}

        {activeTab === "features" && (
          <div className="features-section">
            <h2>App Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <h3>AI Cricket Chat</h3>
                <p>Ask our AI assistant anything about cricket - from player stats to match predictions and rules.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Live Matches</h3>
                <p>Get real-time updates on live cricket matches with scores, teams, and match status.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">📰</div>
                <h3>Cricket News</h3>
                <p>Stay updated with the latest cricket news from reliable sources around the world.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🏏</div>
                <h3>Player Statistics</h3>
                <p>Search for cricket players and view detailed statistics and career information.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🧠</div>
                <h3>Cricket Quiz</h3>
                <p>Test your cricket knowledge with quizzes across different categories and difficulty levels.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <h3>Records & Rankings</h3>
                <p>Explore cricket records, team rankings, and historical achievements in the sport.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Support
