const NodeCache = require("node-cache")

class DataCache {
  constructor() {
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

  setLiveMatches(data) {
    return this.set("live_matches", data, 300) 
  }

  getLiveMatches() {
    return this.get("live_matches")
  }

  setNews(data) {
    return this.set("cricket_news", data, 1800)
  }

  getNews() {
    return this.get("cricket_news")
  }

  setPlayerData(playerId, data) {
    return this.set(`player_${playerId}`, data, 3600) 
  }

  getPlayerData(playerId) {
    return this.get(`player_${playerId}`)
  }
}

module.exports = new DataCache()

