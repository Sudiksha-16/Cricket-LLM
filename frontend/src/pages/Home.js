"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Home.css"

const Home = () => {
  const [liveMatches, setLiveMatches] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [matchesRes, newsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/cricket/matches/live"),
        axios.get("http://localhost:5000/api/cricket/news"),
      ])

      setLiveMatches(matchesRes.data.data || [])
      setNews(newsRes.data.data?.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching home data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Cricket LLM</h1>
        <p>Your AI-powered cricket companion for live scores, player stats, and intelligent cricket discussions</p>
      </div>

      <div className="home-content">
        <section className="live-matches-section">
          <h2>🔴 Live Matches</h2>
          {liveMatches.length > 0 ? (
            <div className="matches-grid">
              {liveMatches.slice(0, 4).map((match) => (
                <div key={match.id} className="match-card">
                  <div className="match-header">
                    <span className="match-format">{match.matchType}</span>
                    <span className="match-status">{match.status}</span>
                  </div>
                  <div className="teams">
                    <div className="team">
                      <span className="team-name">{match.teams?.[0]}</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <span className="team-name">{match.teams?.[1]}</span>
                    </div>
                  </div>
                  <div className="match-venue">📍 {match.venue}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No live matches at the moment</p>
          )}
        </section>

        <section className="news-section">
          <h2>📰 Latest Cricket News</h2>
          {news.length > 0 ? (
            <div className="news-list">
              {news.map((article, index) => (
                <div key={index} className="news-item">
                  <h3>{article.headline}</h3>
                  <p>{article.story}</p>
                  <div className="news-meta">
                    <span>📅 {new Date(article.pubDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No news available</p>
          )}
        </section>

        <section className="features-section">
          <h2>🚀 Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🤖 AI Cricket Chat</h3>
              <p>Ask our AI anything about cricket - from player stats to match predictions</p>
            </div>
            <div className="feature-card">
              <h3>📊 Player Analytics</h3>
              <p>Detailed player statistics and performance analysis</p>
            </div>
            <div className="feature-card">
              <h3>🧠 Cricket Quiz</h3>
              <p>Test your cricket knowledge with our intelligent quiz system</p>
            </div>
            <div className="feature-card">
              <h3>📱 Live Updates</h3>
              <p>Real-time match scores and cricket news updates</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
