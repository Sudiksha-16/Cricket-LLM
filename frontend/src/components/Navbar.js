"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            🏏 Cricket LLM
          </Link>
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏏 Cricket LLM
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/matches" className="nav-link">
            Matches
          </Link>
          <Link to="/players" className="nav-link">
            Players
          </Link>
          <Link to="/news" className="nav-link">
            News
          </Link>
          <Link to="/records" className="nav-link">
            Records
          </Link>
          <Link to="/quiz" className="nav-link">
            Quiz
          </Link>
          <Link to="/chat" className="nav-link">
            AI Chat
          </Link>
          <Link to="/support" className="nav-link">
            Support
          </Link>
          <div className="user-menu">
            <span className="username">Hi, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
