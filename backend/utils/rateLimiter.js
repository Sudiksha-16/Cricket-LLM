const rateLimit = require("express-rate-limit")

// Rate limiter for scraping endpoints
const scrapingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter for AI chat
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chat requests per minute
  message: {
    error: "Too many chat requests, please wait a moment before trying again.",
  },
})

module.exports = {
  scrapingLimiter,
  chatLimiter,
}
