const express = require("express");
const router = express.Router();

const Location = require("../models/Location");

// ==========================================
// SAVE USER LOCATION
// POST /api/location
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      latitude,
      longitude,
      accuracy,
    } = req.body;

    // Check latitude and longitude
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Create location
    const location = new Location({
      userId,
      latitude,
      longitude,
      accuracy,
    });

    // Save to MongoDB
    const savedLocation = await location.save();

    res.status(201).json({
      success: true,
      message: "Location saved successfully",
      location: savedLocation,
    });
  } catch (error) {
    console.error("Location save error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save location",
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL LOCATIONS
// GET /api/location
// ==========================================

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    console.error("Location fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
      error: error.message,
    });
  }
});

// ==========================================
// GET LATEST LOCATION OF A USER
// GET /api/location/user/:userId
// ==========================================

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const location = await Location.findOne({
      userId,
    }).sort({ createdAt: -1 });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      location,
    });
  } catch (error) {
    console.error("User location error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user location",
      error: error.message,
    });
  }
});

module.exports = router;