const express = require("express")
const cricketScraper = require("../services/cricketScraper")
const auth = require("../middleware/auth")

const router = express.Router()

// Get live matches 
router.get("/matches/live", async (req, res) => {
  try {
    const liveMatches = await cricketScraper.getLiveMatches()
    res.json({
      status: "success",
      data: liveMatches,
      count: liveMatches.length,
    })
  } catch (error) {
    console.error("Error fetching live matches:", error)
    res.status(500).json({
      message: "Error fetching live matches",
      error: error.message,
    })
  }
})

// Get upcoming matches 
router.get("/matches/upcoming", async (req, res) => {
  try {
    const upcomingMatches = await cricketScraper.getUpcomingMatches()
    res.json({
      status: "success",
      data: upcomingMatches,
      count: upcomingMatches.length,
    })
  } catch (error) {
    console.error("Error fetching upcoming matches:", error)
    res.status(500).json({
      message: "Error fetching upcoming matches",
      error: error.message,
    })
  }
})

// Get match details 
router.get("/matches/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params
    res.json({
      status: "success",
      data: {
        id: matchId,
        message: "Detailed match information would be scraped from specific match pages",
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching match details" })
  }
})

// Search players 
router.get("/players/search/:name", async (req, res) => {
  try {
    const { name } = req.params
    const players = await cricketScraper.searchPlayers(name)
    res.json({
      status: "success",
      data: players,
      count: players.length,
    })
  } catch (error) {
    console.error("Error searching players:", error)
    res.status(500).json({
      message: "Error searching players",
      error: error.message,
    })
  }
})

// Get player details 
router.get("/players/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params
    const playerDetails = await cricketScraper.getPlayerDetails(playerId)
    res.json({
      status: "success",
      data: playerDetails,
    })
  } catch (error) {
    console.error("Error fetching player details:", error)
    res.status(500).json({
      message: "Error fetching player details",
      error: error.message,
    })
  }
})

// Get cricket news 
router.get("/news", async (req, res) => {
  try {
    const news = await cricketScraper.getCricketNews()
    res.json({
      status: "success",
      data: news,
      count: news.length,
    })
  } catch (error) {
    console.error("Error fetching cricket news:", error)
    res.status(500).json({
      message: "Error fetching cricket news",
      error: error.message,
    })
  }
})

// Get team rankings 
router.get("/rankings/:format", async (req, res) => {
  try {
    const { format } = req.params 
    const rankings = await cricketScraper.getTeamRankings(format)
    res.json({
      status: "success",
      data: rankings,
      count: rankings.length,
    })
  } catch (error) {
    console.error("Error fetching rankings:", error)
    res.status(500).json({
      message: "Error fetching rankings",
      error: error.message,
    })
  }
})

// Get series information 
router.get("/series", async (req, res) => {
  try {
    const mockSeries = [
      {
        id: "1",
        name: "India vs Australia Test Series",
        startDate: "2024-02-01",
        endDate: "2024-03-15",
        format: "Test",
        status: "Ongoing",
      },
      {
        id: "2",
        name: "IPL 2024",
        startDate: "2024-03-22",
        endDate: "2024-05-26",
        format: "T20",
        status: "Upcoming",
      },
    ]

    res.json({
      status: "success",
      data: mockSeries,
      count: mockSeries.length,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching series" })
  }
})

module.exports = router

