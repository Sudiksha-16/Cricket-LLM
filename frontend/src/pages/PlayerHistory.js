"use client"

import { useState } from "react"
import axios from "axios"
import "./PlayerHistory.css"

const PlayerHistory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerDetails, setPlayerDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const searchPlayers = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/cricket/players/search/${searchTerm}`)
      setSearchResults(response.data.data || [])
    } catch (error) {
      console.error("Error searching players:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const getPlayerDetails = async (playerId) => {
    setDetailsLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/cricket/players/${playerId}`)
      setPlayerDetails(response.data.data)
    } catch (error) {
      console.error("Error fetching player details:", error)
      setPlayerDetails(null)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player)
    getPlayerDetails(player.id)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchPlayers()
    }
  }

  const formatStats = (stats) => {
    if (!stats) return null

    return Object.entries(stats).map(([format, data]) => (
      <div key={format} className="format-stats">
        <h4>{format.toUpperCase()}</h4>
        <div className="stats-grid">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="stat-item">
              <span className="stat-label">{key.replace(/([A-Z])/g, " $1").trim()}</span>
              <span className="stat-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    ))
  }

  return (
    <div className="player-history-container">
      <div className="search-section">
        <h1>Player History & Statistics</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for cricket players (e.g., Virat Kohli, MS Dhoni)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={searchPlayers} disabled={loading}>
            {loading ? "🔍 Searching..." : "🔍 Search"}
          </button>
        </div>
      </div>

      <div className="content-section">
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            <div className="players-grid">
              {searchResults.map((player) => (
                <div
                  key={player.id}
                  className={`player-card ${selectedPlayer?.id === player.id ? "selected" : ""}`}
                  onClick={() => handlePlayerSelect(player)}
                >
                  <div className="player-info">
                    <h4>{player.name}</h4>
                    <p>{player.country}</p>
                    {player.role && <span className="player-role">{player.role}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPlayer && (
          <div className="player-details-section">
            <div className="player-header">
              <h2>{selectedPlayer.name}</h2>
              <div className="player-meta">
                <span className="country">🏴 {selectedPlayer.country}</span>
                {selectedPlayer.role && <span className="role">👤 {selectedPlayer.role}</span>}
              </div>
            </div>

            {detailsLoading ? (
              <div className="loading">Loading player details...</div>
            ) : playerDetails ? (
              <div className="player-stats">
                <div className="basic-info">
                  <h3>Basic Information</h3>
                  <div className="info-grid">
                    {playerDetails.dateOfBirth && (
                      <div className="info-item">
                        <span className="info-label">Date of Birth</span>
                        <span className="info-value">{new Date(playerDetails.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                    {playerDetails.birthPlace && (
                      <div className="info-item">
                        <span className="info-label">Birth Place</span>
                        <span className="info-value">{playerDetails.birthPlace}</span>
                      </div>
                    )}
                    {playerDetails.battingStyle && (
                      <div className="info-item">
                        <span className="info-label">Batting Style</span>
                        <span className="info-value">{playerDetails.battingStyle}</span>
                      </div>
                    )}
                    {playerDetails.bowlingStyle && (
                      <div className="info-item">
                        <span className="info-label">Bowling Style</span>
                        <span className="info-value">{playerDetails.bowlingStyle}</span>
                      </div>
                    )}
                  </div>
                </div>

                {playerDetails.stats && (
                  <div className="career-stats">
                    <h3>Career Statistics</h3>
                    {formatStats(playerDetails.stats)}
                  </div>
                )}

                {playerDetails.teams && playerDetails.teams.length > 0 && (
                  <div className="teams-section">
                    <h3>Teams</h3>
                    <div className="teams-list">
                      {playerDetails.teams.map((team, index) => (
                        <span key={index} className="team-badge">
                          {team}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-details">
                <p>Unable to load player details. Please try again.</p>
              </div>
            )}
          </div>
        )}

        {searchResults.length === 0 && searchTerm && !loading && (
          <div className="no-results">
            <h3>No players found</h3>
            <p>Try searching with a different name or spelling</p>
          </div>
        )}

        {!searchTerm && (
          <div className="search-prompt">
            <h3>🏏 Discover Cricket Players</h3>
            <p>Search for your favorite cricket players to view their detailed statistics and career information</p>
            <div className="popular-searches">
              <h4>Popular searches:</h4>
              <div className="search-suggestions">
                {["Virat Kohli", "MS Dhoni", "Rohit Sharma", "Babar Azam", "Joe Root", "Steve Smith"].map((name) => (
                  <button
                    key={name}
                    className="suggestion-btn"
                    onClick={() => {
                      setSearchTerm(name)
                      setTimeout(searchPlayers, 100)
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerHistory
