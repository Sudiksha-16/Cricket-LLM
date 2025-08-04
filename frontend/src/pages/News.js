"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./News.css"

const News = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cricket/news")
      setNews(response.data.data || [])
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredNews =
    selectedCategory === "all"
      ? news
      : news.filter(
          (article) =>
            article.headline.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            article.story.toLowerCase().includes(selectedCategory.toLowerCase()),
        )

  if (loading) {
    return <div className="loading">Loading cricket news...</div>
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Cricket News</h1>
        <p>Stay updated with the latest cricket news from around the world</p>

        <div className="category-filters">
          <button className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>
            All News
          </button>
          <button className={selectedCategory === "india" ? "active" : ""} onClick={() => setSelectedCategory("india")}>
            India
          </button>
          <button className={selectedCategory === "ipl" ? "active" : ""} onClick={() => setSelectedCategory("ipl")}>
            IPL
          </button>
          <button
            className={selectedCategory === "international" ? "active" : ""}
            onClick={() => setSelectedCategory("international")}
          >
            International
          </button>
        </div>
      </div>

      <div className="news-content">
        {filteredNews.length > 0 ? (
          <div className="news-grid">
            {filteredNews.map((article, index) => (
              <div key={index} className="news-card">
                <div className="news-content-text">
                  <h3 className="news-title">{article.headline}</h3>
                  <p className="news-summary">{article.story}</p>
                  <div className="news-meta">
                    <span className="news-date">📅 {formatDate(article.pubDate)}</span>
                    {article.source && <span className="news-source">📰 {article.source}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-news">
            <h3>No news available</h3>
            <p>Check back later for the latest cricket updates!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default News
