"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Matches.css"

const Matches = () => {
  const [activeTab, setActiveTab] = useState("live")
  const [liveMatches, setLiveMatches] = useState([])
  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const [liveRes, upcomingRes] = await Promise.all([
        axios.get("http://localhost:5000/api/cricket/matches/live"),
        axios.get("http://localhost:5000/api/cricket/matches/upcoming"),
      ])

      setLiveMatches(liveRes.data.data || [])
      setUpcomingMatches(upcomingRes.data.data || [])
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMatchStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
      case "in progress":
        return "#ff4444"
      case "completed":
        return "#28a745"
      case "upcoming":
        return "#ffc107"
      default:
        return "#6c757d"
    }
  }

  if (loading) {
    return <div className="loading">Loading matches...</div>
  }

  return (
    <div className="matches-container">
      <div className="matches-header">
        <h1>Cricket Matches</h1>
        <div className="tab-buttons">
          <button className={activeTab === "live" ? "active" : ""} onClick={() => setActiveTab("live")}>
            🔴 Live ({liveMatches.length})
          </button>
          <button className={activeTab === "upcoming" ? "active" : ""} onClick={() => setActiveTab("upcoming")}>
            📅 Upcoming ({upcomingMatches.length})
          </button>
        </div>
      </div>

      <div className="matches-content">
        {activeTab === "live" && (
          <div className="matches-section">
            {liveMatches.length > 0 ? (
              <div className="matches-grid">
                {liveMatches.map((match) => (
                  <div key={match.id} className="match-card live">
                    <div className="match-header">
                      <span className="match-format">{match.matchType}</span>
                      <span className="match-status" style={{ backgroundColor: getMatchStatusColor(match.status) }}>
                        {match.status}
                      </span>
                    </div>

                    <div className="teams-section">
                      <div className="team">
                        <span className="team-name">{match.teams?.[0]}</span>
                        {match.score?.[0] && <span className="team-score">{match.score[0]}</span>}
                      </div>

                      <div className="vs">VS</div>

                      <div className="team">
                        <span className="team-name">{match.teams?.[1]}</span>
                        {match.score?.[1] && <span className="team-score">{match.score[1]}</span>}
                      </div>
                    </div>

                    <div className="match-details">
                      <div className="venue">📍 {match.venue}</div>
                      <div className="series">🏆 {match.series}</div>
                      {match.date && <div className="date">📅 {formatDate(match.date)}</div>}
                    </div>

                    {match.status && match.status !== "upcoming" && <div className="match-result">{match.status}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-matches">
                <h3>No live matches at the moment</h3>
                <p>Check back later for live cricket action!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "upcoming" && (
          <div className="matches-section">
            {upcomingMatches.length > 0 ? (
              <div className="matches-grid">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="match-card upcoming">
                    <div className="match-header">
                      <span className="match-format">{match.matchType}</span>
                      <span className="match-status" style={{ backgroundColor: getMatchStatusColor(match.status) }}>
                        {match.status}
                      </span>
                    </div>

                    <div className="teams-section">
                      <div className="team">
                        <span className="team-name">{match.teams?.[0]}</span>
                      </div>

                      <div className="vs">VS</div>

                      <div className="team">
                        <span className="team-name">{match.teams?.[1]}</span>
                      </div>
                    </div>

                    <div className="match-details">
                      <div className="venue">📍 {match.venue}</div>
                      <div className="series">🏆 {match.series}</div>
                      {match.date && <div className="date">📅 {formatDate(match.date)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-matches">
                <h3>No upcoming matches scheduled</h3>
                <p>Stay tuned for future cricket fixtures!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Matches
