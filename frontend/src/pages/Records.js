"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Records.css"

const Records = () => {
  const [activeTab, setActiveTab] = useState("batting")
  const [rankings, setRankings] = useState({
    test: [],
    odi: [],
    t20: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      const [testRes, odiRes, t20Res] = await Promise.all([
        axios.get("http://localhost:5000/api/cricket/rankings/test"),
        axios.get("http://localhost:5000/api/cricket/rankings/odi"),
        axios.get("http://localhost:5000/api/cricket/rankings/t20"),
      ])

      setRankings({
        test: testRes.data.data || [],
        odi: odiRes.data.data || [],
        t20: t20Res.data.data || [],
      })
    } catch (error) {
      console.error("Error fetching rankings:", error)
    } finally {
      setLoading(false)
    }
  }

  const cricketRecords = {
    batting: [
      {
        category: "Test Cricket",
        records: [
          { record: "Highest Individual Score", holder: "Brian Lara", value: "400*", details: "vs England, 2004" },
          { record: "Most Runs", holder: "Sachin Tendulkar", value: "15,921", details: "200 matches" },
          { record: "Most Centuries", holder: "Sachin Tendulkar", value: "51", details: "200 matches" },
          { record: "Highest Average", holder: "Don Bradman", value: "99.94", details: "52 matches" },
        ],
      },
      {
        category: "ODI Cricket",
        records: [
          { record: "Highest Individual Score", holder: "Rohit Sharma", value: "264", details: "vs Sri Lanka, 2014" },
          { record: "Most Runs", holder: "Sachin Tendulkar", value: "18,426", details: "463 matches" },
          { record: "Most Centuries", holder: "Sachin Tendulkar", value: "49", details: "463 matches" },
          { record: "Fastest Century", holder: "AB de Villiers", value: "31 balls", details: "vs West Indies, 2015" },
        ],
      },
      {
        category: "T20 Cricket",
        records: [
          { record: "Highest Individual Score", holder: "Aaron Finch", value: "172", details: "vs Zimbabwe, 2018" },
          { record: "Most Runs", holder: "Virat Kohli", value: "4,008", details: "115 matches" },
          { record: "Most Centuries", holder: "Rohit Sharma", value: "5", details: "148 matches" },
          { record: "Fastest Century", holder: "David Miller", value: "35 balls", details: "vs Bangladesh, 2017" },
        ],
      },
    ],
    bowling: [
      {
        category: "Test Cricket",
        records: [
          { record: "Most Wickets", holder: "Muttiah Muralitharan", value: "800", details: "133 matches" },
          { record: "Best Bowling Figures", holder: "Jim Laker", value: "10/53", details: "vs Australia, 1956" },
          { record: "Best Match Figures", holder: "Jim Laker", value: "19/90", details: "vs Australia, 1956" },
          { record: "Best Average", holder: "George Lohmann", value: "10.75", details: "18 matches" },
        ],
      },
      {
        category: "ODI Cricket",
        records: [
          { record: "Most Wickets", holder: "Muttiah Muralitharan", value: "534", details: "350 matches" },
          { record: "Best Bowling Figures", holder: "Chaminda Vaas", value: "8/19", details: "vs Zimbabwe, 2001" },
          { record: "Best Economy Rate", holder: "Joel Garner", value: "3.09", details: "98 matches" },
          { record: "Most 5-wicket Hauls", holder: "Waqar Younis", value: "13", details: "262 matches" },
        ],
      },
      {
        category: "T20 Cricket",
        records: [
          { record: "Most Wickets", holder: "Lasith Malinga", value: "107", details: "84 matches" },
          { record: "Best Bowling Figures", holder: "Deepak Chahar", value: "6/7", details: "vs Bangladesh, 2019" },
          { record: "Best Economy Rate", holder: "Anil Kumble", value: "4.14", details: "1 match" },
          { record: "Most Hat-tricks", holder: "Lasith Malinga", value: "2", details: "84 matches" },
        ],
      },
    ],
    team: [
      {
        category: "Test Cricket",
        records: [
          { record: "Highest Team Total", holder: "Sri Lanka", value: "952/6d", details: "vs India, 1997" },
          { record: "Lowest Team Total", holder: "New Zealand", value: "26", details: "vs England, 1955" },
          { record: "Most Consecutive Wins", holder: "Australia", value: "16", details: "1999-2001" },
          { record: "Longest Match", holder: "South Africa vs England", value: "12 days", details: "1939" },
        ],
      },
      {
        category: "ODI Cricket",
        records: [
          { record: "Highest Team Total", holder: "England", value: "498/4", details: "vs Netherlands, 2022" },
          { record: "Lowest Team Total", holder: "Zimbabwe", value: "35", details: "vs Sri Lanka, 2004" },
          { record: "Highest Successful Chase", holder: "Ireland", value: "329", details: "vs England, 2011" },
          { record: "Most Consecutive Wins", holder: "Australia", value: "21", details: "2003" },
        ],
      },
      {
        category: "T20 Cricket",
        records: [
          { record: "Highest Team Total", holder: "Afghanistan", value: "278/3", details: "vs Ireland, 2019" },
          { record: "Lowest Team Total", holder: "Turkey", value: "21", details: "vs Czech Republic, 2019" },
          { record: "Highest Successful Chase", holder: "West Indies", value: "236", details: "vs South Africa, 2015" },
          { record: "Most Consecutive Wins", holder: "Afghanistan", value: "12", details: "2018-2019" },
        ],
      },
    ],
  }

  const tabData = [
    { id: "batting", name: "Batting Records", icon: "🏏" },
    { id: "bowling", name: "Bowling Records", icon: "⚡" },
    { id: "team", name: "Team Records", icon: "🏆" },
    { id: "rankings", name: "Current Rankings", icon: "📊" },
  ]

  if (loading && activeTab === "rankings") {
    return <div className="loading">Loading cricket records...</div>
  }

  return (
    <div className="records-container">
      <div className="records-header">
        <h1>Cricket Records & Rankings</h1>
        <p>Explore the greatest achievements in cricket history</p>
      </div>

      <div className="records-tabs">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <div className="records-content">
        {activeTab === "rankings" ? (
          <div className="rankings-section">
            <div className="rankings-grid">
              {Object.entries(rankings).map(([format, teams]) => (
                <div key={format} className="ranking-card">
                  <h3>{format.toUpperCase()} Rankings</h3>
                  <div className="ranking-list">
                    {teams.slice(0, 10).map((team, index) => (
                      <div key={index} className="ranking-item">
                        <span className="rank">#{team.rank || index + 1}</span>
                        <span className="team-name">{team.team}</span>
                        <span className="points">{team.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="records-section">
            {cricketRecords[activeTab]?.map((category, index) => (
              <div key={index} className="category-section">
                <h3>{category.category}</h3>
                <div className="records-grid">
                  {category.records.map((record, recordIndex) => (
                    <div key={recordIndex} className="record-card">
                      <div className="record-header">
                        <h4>{record.record}</h4>
                        <span className="record-value">{record.value}</span>
                      </div>
                      <div className="record-details">
                        <p className="record-holder">{record.holder}</p>
                        <p className="record-info">{record.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Records
