// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/authMiddleware").isAdmin;

// Admin-only routes - all require authentication and admin role
router.get("/dashboard", authMiddleware, isAdmin, adminController.getDashboardStats);
router.get("/users", authMiddleware, isAdmin, adminController.getAllUsers);
router.get("/users/:id", authMiddleware, isAdmin, adminController.getUserById);
router.put("/users/:id", authMiddleware, isAdmin, adminController.updateUser);
router.delete("/users/:id", authMiddleware, isAdmin, adminController.deleteUser);
router.put("/approve/:id", authMiddleware, isAdmin, adminController.approveAgent);

// --- Property management routes ---
router.get("/properties", authMiddleware, isAdmin, adminController.getAllProperties); // View all properties
router.delete("/properties/:id", authMiddleware, isAdmin, adminController.deleteProperty); // Delete property by ID




// Mark property as featured/unfeatured
router.put("/properties/:id/feature", authMiddleware, isAdmin, adminController.featureProperty);



module.exports = router;
