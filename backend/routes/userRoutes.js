const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Register user with profile picture
router.post("/register", upload.single("profileImage"), userController.register);

// Login user
router.post("/login", userController.login);
// Logout route (client should delete token)
router.post("/logout", userController.logout);

// Protected route - Get user profile (requires authentication)
router.get("/profile", authMiddleware, userController.getProfile);

// Admin fetches all users
router.get("/public/agents", userController.getPublicAgents);

// Admin approves agent
router.put("/approve/:id", userController.approveAgent);
//refresh token
router.post("/refresh", userController.refreshToken);

// Update user profile
router.put(
  "/profile/update",
  authMiddleware,
  upload.single("profileImage"),
  userController.updateProfile
);
// favourites
router.post("/favourites/add", authMiddleware, userController.addFavourite);
router.post("/favourites/remove", authMiddleware, userController.removeFavourite);
router.get("/favourites", authMiddleware, userController.getFavourites);
// Forgot + Reset Password
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
module.exports = router;
