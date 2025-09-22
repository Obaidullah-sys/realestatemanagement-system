const Review = require("../models/Review");
const Property = require("../models/Property");
const User = require("../models/User");

// PUBLIC: Add a review for any property
exports.addReview = async (req, res) => {
  try {
    const { propertyId, name, comment } = req.body;

    if (!propertyId || !name || !comment) {
      return res.status(400).json({ error: "Property ID, name, and comment are required" });
    }

    const property = await Property.findById(propertyId).populate("agent");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const review = new Review({
      property: property._id,
      agent: property.agent._id,
      name,
      comment
    });

    await review.save();

    res.status(201).json({ success: true, message: "Review submitted successfully" });

  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

// PUBLIC: Get reviews for all properties of logged-in agent
exports.getReviewsProperty = async (req, res) => {
  try {
    const agentId = req.user.id;

    // Get all properties owned by the agent
    const properties = await Property.find({ agent: agentId });
    const propertyIds = properties.map((p) => p._id);

    // Find reviews for all those properties
    const reviews = await Review.find({
      property: { $in: propertyIds },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .populate("property", "title");

    const formattedReviews = reviews.map((review) => ({
      propertyId: review.property?._id,   // 👈 include property id
      propertyTitle: review.property?.title,
      name: review.name,
      comment: review.comment,
      createdAt: review.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedReviews.length,
      reviews: formattedReviews,
    });

  } catch (error) {
    console.error("Error fetching agent reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// AGENT: View reviews for properties they own
exports.getAgentReviews = async (req, res) => {
  try {
    const agentId = req.user.userId;

    // Check if user is an approved agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent" || !agent.isApproved) {
      return res.status(403).json({ error: "Only approved agents can access this route" });
    }

    // Find reviews and populate property
    const reviews = await Review.find({
      agent: agentId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .populate("property", "propertyType");

    // Format and send response
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews: reviews.map(r => ({
        propertyId: r.property?._id,         // 👈 include property id
        propertyType: r.property?.propertyType || "Unknown",
        name: r.name,
        comment: r.comment,
        createdAt: r.createdAt
      }))
    });

  } catch (error) {
    console.error("Error getting agent reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// PUBLIC: Get all reviews for a specific property
exports.fetchPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find reviews linked to this property only
    const allReviews = await Review.find({ property: propertyId, isActive: true })
      .sort({ createdAt: -1 })
      .populate("property", "title");

    // Restructure the response
    const response = allReviews.map((r) => ({
      propertyId: r.property?._id,       // 👈 include property id
      propertyName: r.property?.title || "Unknown Property",
      reviewer: r.name,
      feedback: r.comment,
      date: r.createdAt,
    }));

    res.status(200).json({
      ok: true,
      total: response.length,
      reviews: response,
    });
  } catch (err) {
    console.error("❌ Could not fetch property reviews:", err);
    res.status(500).json({ message: "Error fetching property reviews" });
  }
};
