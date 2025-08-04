const axios = require("axios")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")

class CricketScraper {
  constructor() {
    this.baseHeaders = {
      "User-Agent": process.env.USER_AGENT || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      Connection: "keep-alive",
    }
    this.delay = Number.parseInt(process.env.SCRAPING_DELAY) || 2000
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Scrape live matches from Cricbuzz
  async getLiveMatches() {
    try {
      const response = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", {
        headers: this.baseHeaders,
      })

      const $ = cheerio.load(response.data)
      const matches = []

      $(".cb-mtch-lst").each((index, element) => {
        const matchElement = $(element)
        const teams = []
        const scores = []

        matchElement.find(".cb-ovr-flo .cb-hmscg-tm-nm").each((i, team) => {
          teams.push($(team).text().trim())
        })

        matchElement.find(".cb-ovr-flo .cb-hmscg-tm-nm + div").each((i, score) => {
          scores.push($(score).text().trim())
        })

        const matchInfo = matchElement.find(".cb-mtch-info").text().trim()
        const venue = matchElement.find(".text-gray").text().trim()
        const status = matchElement.find(".cb-text-live, .cb-text-complete").text().trim()

        if (teams.length >= 2) {
          matches.push({
            id: `cricbuzz_${index}`,
            teams: teams.slice(0, 2),
            scores: scores.slice(0, 2),
            matchType: this.extractMatchType(matchInfo),
            venue: venue,
            status: status || "Live",
            series: matchInfo,
            date: new Date().toISOString(),
          })
        }
      })

      return matches.slice(0, 10) // Limit to 10 matches
    } catch (error) {
      console.error("Error scraping live matches:", error)
      return []
    }
  }

  // Scrape upcoming matches
  async getUpcomingMatches() {
    try {
      const response = await axios.get("https://www.cricbuzz.com/cricket-schedule/upcoming-matches", {
        headers: this.baseHeaders,
      })

      const $ = cheerio.load(response.data)
      const matches = []

      $(".cb-sch-lst-itm").each((index, element) => {
        const matchElement = $(element)
        const teams = []

        matchElement.find(".cb-ovr-flo .cb-hmscg-tm-nm").each((i, team) => {
          teams.push($(team).text().trim())
        })

        const matchInfo = matchElement.find(".cb-mtch-info").text().trim()
        const venue = matchElement.find(".text-gray").text().trim()
        const dateTime = matchElement.find(".cb-font-12").text().trim()

        if (teams.length >= 2) {
          matches.push({
            id: `upcoming_${index}`,
            teams: teams.slice(0, 2),
            matchType: this.extractMatchType(matchInfo),
            venue: venue,
            status: "Upcoming",
            series: matchInfo,
            date: this.parseDate(dateTime),
          })
        }
      })

      return matches.slice(0, 15)
    } catch (error) {
      console.error("Error scraping upcoming matches:", error)
      return []
    }
  }

  // Scrape cricket news from multiple sources
  async getCricketNews() {
    try {
      const sources = [
        {
          url: "https://www.cricbuzz.com/cricket-news",
          selector: ".cb-nws-lst-rt",
          titleSelector: ".cb-nws-hdln",
          summarySelector: ".cb-nws-intr",
          dateSelector: ".cb-nws-time",
        },
        {
          url: "https://www.espncricinfo.com/story",
          selector: ".ds-p-4",
          titleSelector: "h2",
          summarySelector: "p",
          dateSelector: ".ds-text-tight-s",
        },
      ]

      const allNews = []

      for (const source of sources) {
        try {
          const response = await axios.get(source.url, { headers: this.baseHeaders })
          const $ = cheerio.load(response.data)

          $(source.selector).each((index, element) => {
            if (index >= 10) return false // Limit per source

            const newsElement = $(element)
            const title = newsElement.find(source.titleSelector).text().trim()
            const summary = newsElement.find(source.summarySelector).text().trim()
            const dateText = newsElement.find(source.dateSelector).text().trim()

            if (title && summary) {
              allNews.push({
                headline: title,
                story: summary.substring(0, 300) + "...",
                pubDate: this.parseNewsDate(dateText),
                source: source.url.includes("cricbuzz") ? "Cricbuzz" : "ESPNCricinfo",
              })
            }
          })

          await this.delay(this.delay) // Respectful scraping
        } catch (sourceError) {
          console.error(`Error scraping ${source.url}:`, sourceError.message)
        }
      }

      return allNews.slice(0, 20)
    } catch (error) {
      console.error("Error scraping cricket news:", error)
      return []
    }
  }

  // Scrape player information
  async searchPlayers(playerName) {
    try {
      const searchUrl = `https://www.cricbuzz.com/profiles/${playerName.toLowerCase().replace(/\s+/g, "-")}`
      const response = await axios.get(searchUrl, { headers: this.baseHeaders })
      const $ = cheerio.load(response.data)

      const players = []
      const name = $(".cb-font-40").text().trim()
      const country = $(".cb-font-12 .text-gray").text().trim()
      const role = $(".cb-lst-itm-sm").text().trim()

      if (name) {
        players.push({
          id: playerName.toLowerCase().replace(/\s+/g, "-"),
          name: name,
          country: country,
          role: role,
        })
      }

      return players
    } catch (error) {
      // Fallback: return mock data for common players
      return this.getMockPlayerData(playerName)
    }
  }

  // Get player details
  async getPlayerDetails(playerId) {
    try {
      const playerUrl = `https://www.cricbuzz.com/profiles/${playerId}`
      const response = await axios.get(playerUrl, { headers: this.baseHeaders })
      const $ = cheerio.load(response.data)

      const playerData = {
        name: $(".cb-font-40").text().trim(),
        country: $(".cb-font-12 .text-gray").text().trim(),
        role: $(".cb-lst-itm-sm").text().trim(),
        birthPlace: $(".cb-lst-itm:contains('Born')").text().replace("Born", "").trim(),
        battingStyle: $(".cb-lst-itm:contains('Batting Style')").text().replace("Batting Style", "").trim(),
        bowlingStyle: $(".cb-lst-itm:contains('Bowling Style')").text().replace("Bowling Style", "").trim(),
        stats: this.extractPlayerStats($),
      }

      return playerData
    } catch (error) {
      console.error("Error getting player details:", error)
      return null
    }
  }

  // Get team rankings
  async getTeamRankings(format = "test") {
    try {
      const rankingsUrl = `https://www.cricbuzz.com/cricket-stats/icc-rankings/men/${format}`
      const response = await axios.get(rankingsUrl, { headers: this.baseHeaders })
      const $ = cheerio.load(response.data)

      const rankings = []
      $(".cb-col-84 .cb-lst-itm").each((index, element) => {
        const team = $(element).find(".cb-font-16").text().trim()
        const points = $(element).find(".cb-font-12").text().trim()

        if (team && points) {
          rankings.push({
            rank: index + 1,
            team: team,
            points: points,
          })
        }
      })

      return rankings
    } catch (error) {
      console.error("Error scraping rankings:", error)
      return []
    }
  }

  // Helper methods
  extractMatchType(matchInfo) {
    if (matchInfo.toLowerCase().includes("test")) return "Test"
    if (matchInfo.toLowerCase().includes("odi")) return "ODI"
    if (matchInfo.toLowerCase().includes("t20")) return "T20"
    return "Cricket"
  }

  parseDate(dateString) {
    try {
      return new Date(dateString).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  parseNewsDate(dateText) {
    try {
      if (dateText.includes("ago")) {
        return new Date().toISOString()
      }
      return new Date(dateText).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  extractPlayerStats($) {
    const stats = {}
    $(".cb-col").each((index, element) => {
      const format = $(element).find("h3").text().trim().toLowerCase()
      if (format) {
        const formatStats = {}
        $(element)
          .find(".cb-lst-itm")
          .each((i, stat) => {
            const statText = $(stat).text().trim()
            const [key, value] = statText.split(":").map((s) => s.trim())
            if (key && value) {
              formatStats[key.toLowerCase().replace(/\s+/g, "")] = value
            }
          })
        if (Object.keys(formatStats).length > 0) {
          stats[format] = formatStats
        }
      }
    })
    return stats
  }

  getMockPlayerData(playerName) {
    const mockPlayers = {
      "virat kohli": [
        {
          id: "virat-kohli",
          name: "Virat Kohli",
          country: "India",
          role: "Batsman",
        },
      ],
      "ms dhoni": [
        {
          id: "ms-dhoni",
          name: "MS Dhoni",
          country: "India",
          role: "Wicket-keeper Batsman",
        },
      ],
      "rohit sharma": [
        {
          id: "rohit-sharma",
          name: "Rohit Sharma",
          country: "India",
          role: "Batsman",
        },
      ],
    }

    return mockPlayers[playerName.toLowerCase()] || []
  }
}

module.exports = new CricketScraper()
