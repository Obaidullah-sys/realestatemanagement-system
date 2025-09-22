const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes - Users can send additional messages to existing tours
router.post("/user/send", messageController.userSendMessage);
router.get("/user/tour/:tourId", messageController.getTourMessages);
router.get("/user/tours", messageController.getUserTours);

// Agent routes - require authentication
router.post("/agent/reply", authMiddleware, messageController.agentReply);
router.get("/agent/tours", authMiddleware, messageController.getAgentTours);
router.get("/agent/tour/:tourId", authMiddleware, messageController.getTourMessages);
router.put("/agent/tour/:tourId/read", authMiddleware, messageController.markAsRead);

module.exports = router;