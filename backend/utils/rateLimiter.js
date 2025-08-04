const rateLimit = require("express-rate-limit")

const scrapingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: {
    error: "Too many chat requests, please wait a moment before trying again.",
  },
})

module.exports = {
  scrapingLimiter,
  chatLimiter,
}
