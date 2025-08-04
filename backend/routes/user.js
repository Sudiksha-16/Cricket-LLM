const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Update user preferences
router.put("/preferences", auth, async (req, res) => {
  try {
    const { favoriteTeams, favoritePlayers } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        favoriteTeams,
        favoritePlayers,
      },
      { new: true },
    ).select("-password")

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error updating preferences" })
  }
})

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" })
  }
})

module.exports = router
