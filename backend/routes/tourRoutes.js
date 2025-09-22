const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes - Website visitors can access these without login
router.get("/properties", tourController.getAvailableProperties);           // Browse available properties
router.get("/properties/:id", tourController.getPropertyForTour);           // Get specific property details
router.post("/schedule", tourController.scheduleTour);   
                // Schedule a tour

// Agent routes - require authentication
router.get("/my-tours", authMiddleware, tourController.getMyTours);
router.get("/my-tours/stats", authMiddleware, tourController.getTourStats);
router.get("/my-tours/:id", authMiddleware, tourController.getTourById);
router.put("/my-tours/:id/status", authMiddleware, tourController.updateTourStatus);

// Admin routes - require admin authentication
router.get("/all", authMiddleware, authMiddleware.isAdmin, tourController.getAllTours);

module.exports = router; 