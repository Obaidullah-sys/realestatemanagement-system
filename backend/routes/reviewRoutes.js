// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Public users can post reviews
router.post("/add", reviewController.addReview);
const { fetchPropertyReviews } = require("../controllers/reviewController");

router.get("/property/:propertyId", fetchPropertyReviews); // public route

// Public can see reviews of a property
const { getReviewsProperty } = require('../controllers/reviewController');

router.get('/property/:propertyId', getReviewsProperty); // ✅ CORRECT


// Agent can view reviews for their properties
router.get("/my-reviews", authMiddleware, reviewController.getAgentReviews);

module.exports = router;
