const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Middleware to check if user is an approved agent
const isApprovedAgent = async (req, res, next) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== "agent" || !user.isApproved) {
      return res.status(403).json({ 
        error: "Only approved agents can access property features" 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication error" });
  }
};

// PUBLIC ROUTES
router.get("/type/:type", propertyController.getPropertiesByType);
router.get("/type-counts", propertyController.getPropertyTypeCounts);
router.get("/city-counts", propertyController.getCityCounts);
router.get("/city/:city", propertyController.getPropertiesByCity);
router.get("/search", propertyController.searchProperties);
router.get("/all", propertyController.getAllProperties);
router.get("/compare", propertyController.compareProperties);// /api/properties/compare?ids=123,456
// Public route to get properties by status (available or rented)
// ✅ Public routes
router.get("/featured", propertyController.getFeaturedProperties);
router.get("/status/:status", propertyController.getPropertiesByStatus); //

router.get("/public/:id", propertyController.getPropertyById); 


// rename to avoid conflict with protected

// PROTECTED ROUTES (require authentication + approved agent)
router.use(authMiddleware, isApprovedAgent); // apply middleware to all protected routes below

router.get("/my-properties", propertyController.getMyProperties);
router.get("/stats", propertyController.getPropertyStats);
router.post("/", upload.array("images", 5), propertyController.addProperty);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", upload.array("images", 5), propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);
router.patch("/:id/restore", propertyController.restoreProperty);

module.exports = router;
