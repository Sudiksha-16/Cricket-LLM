const NodeCache = require("node-cache")

class DataCache {
  constructor() {
    // Cache for 10 minutes for live data, 1 hour for static data
    this.cache = new NodeCache({ stdTTL: 600 })
  }

  set(key, data, ttl = 600) {
    return this.cache.set(key, data, ttl)
  }

  get(key) {
    return this.cache.get(key)
  }

  del(key) {
    return this.cache.del(key)
  }

  flush() {
    return this.cache.flushAll()
  }

  // Specific methods for cricket data
  setLiveMatches(data) {
    return this.set("live_matches", data, 300) // 5 minutes for live data
  }

  getLiveMatches() {
    return this.get("live_matches")
  }

  setNews(data) {
    return this.set("cricket_news", data, 1800) // 30 minutes for news
  }

  getNews() {
    return this.get("cricket_news")
  }

  setPlayerData(playerId, data) {
    return this.set(`player_${playerId}`, data, 3600) // 1 hour for player data
  }

  getPlayerData(playerId) {
    return this.get(`player_${playerId}`)
  }
}

module.exports = new DataCache()
