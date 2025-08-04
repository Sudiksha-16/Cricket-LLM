const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const cron = require("node-cron")
const authRoutes = require("./routes/auth")
const cricketRoutes = require("./routes/cricket")
const chatRoutes = require("./routes/chat")
const userRoutes = require("./routes/user")
const quizRoutes = require("./routes/quiz")
const { scrapingLimiter, chatLimiter } = require("./utils/rateLimiter")
const dataCache = require("./services/dataCache")
const cricketScraper = require("./services/cricketScraper")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rate limiting
app.use("/api/cricket", scrapingLimiter)
app.use("/api/chat", chatLimiter)

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cricket-llm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/cricket", cricketRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/user", userRoutes)
app.use("/api/quiz", quizRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      cache: "Active",
      scraper: "Active",
    },
  })
})

// Background job to refresh cricket data every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("Refreshing cricket data...")
  try {
    const liveMatches = await cricketScraper.getLiveMatches()
    dataCache.setLiveMatches(liveMatches)
    console.log(`Cached ${liveMatches.length} live matches`)
  } catch (error) {
    console.error("Error refreshing cricket data:", error)
  }
})

// Background job to refresh news every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("Refreshing cricket news...")
  try {
    const news = await cricketScraper.getCricketNews()
    dataCache.setNews(news)
    console.log(`Cached ${news.length} news articles`)
  } catch (error) {
    console.error("Error refreshing news:", error)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log("🏏 Cricket LLM Backend with Free APIs")
  console.log("📊 Using Hugging Face for AI")
  console.log("🕷️ Using Web Scraping for Cricket Data")
})
