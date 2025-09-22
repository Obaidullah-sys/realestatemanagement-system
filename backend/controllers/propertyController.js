const Property = require("../models/Property");
const User = require("../models/User");
const mongoose = require("mongoose");

// Add new property (Agent only)
exports.addProperty = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const agentId = req.user.userId;

    // Check if agent is approved
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent" || !agent.isApproved) {
      return res.status(403).json({ 
        error: "Only approved agents can add properties" 
      });
    }

    // ✅ Parse JSON strings sent from FormData
    const location = JSON.parse(req.body.location);
    const features = JSON.parse(req.body.features);
    const amenities = JSON.parse(req.body.amenities); // <-- ADD THIS LINE

    const {
      title,
      description,
      price,
      propertyType,
      status
    } = req.body;

    const property = new Property({
      title,
      description,
      price,
      propertyType,
      status,
      location,
      features,
      amenities,
      agent: agentId,
      images: req.files ? req.files.map(file => file.filename) : []
    });

    await property.save();

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: {
        id: property._id,
        title: property.title,
        price: property.price,
        location: property.location,
        propertyType: property.propertyType,
        status: property.status,
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email
        },
        createdAt: property.createdAt
      }
    });

  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ 
      error: "Failed to add property",
      details: error.message 
    });
  }
};
// Get property statistics for the agent
// GET property stats
// Get property statistics for the logged-in agent
exports.getPropertyStats = async (req, res) => {
  try {
    const agentId = req.user.userId; // userId comes from authMiddleware
    console.log("Agent ID:", agentId); // ✅ will log in terminal

    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ error: "Invalid agent ID" });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent" || !agent.isApproved) {
      return res.status(403).json({ error: "Only approved agents can view property statistics" });
    }

    const stats = await Property.aggregate([
      { $match: { agent: new mongoose.Types.ObjectId(agentId), isActive: true } },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          totalValue: { $sum: "$price" },
          averagePrice: { $avg: "$price" },
          availableProperties: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
          soldProperties: { $sum: { $cond: [{ $eq: ["$status", "sold"] }, 1, 0] } },
          pendingProperties: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
    ]);

    const propertyTypeStats = await Property.aggregate([
      { $match: { agent: new mongoose.Types.ObjectId(agentId), isActive: true } },
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalProperties: 0,
        totalValue: 0,
        averagePrice: 0,
        availableProperties: 0,
        soldProperties: 0,
        pendingProperties: 0,
      },
      propertyTypeStats,
    });
  } catch (error) {
    console.error("Error getting property stats:", error);
    res.status(500).json({ error: "Failed to get property statistics", details: error.message });
  }
};

// Get all properties for the logged-in agent
exports.getMyProperties = async (req, res) => {
  try {
    const agentId = req.user?.userId;
    console.log("Agent ID:", agentId); // ✅ will log in terminal

    if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ error: "Invalid agent ID" });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent" || !agent.isApproved) {
      return res.status(403).json({ error: "Only approved agents can view their properties" });
    }

    const { page = 1, limit = 10, status, propertyType } = req.query;
    const skip = (page - 1) * limit;

    const filter = { agent: new mongoose.Types.ObjectId(agentId), isActive: true };
    if (status) filter.status = status;
    if (propertyType) filter.propertyType = propertyType;

    const properties = await Property.find(filter)
      .populate("agent", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: properties.length,
      totalProperties: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ error: "Failed to get properties", details: error.message });
  }
};

// Get property by ID (Agent can only see their own properties)
exports.getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();
    const agentId = req.user.userId;

    // Validate ObjectId format
    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID format" 
      });
    }

    const property = await Property.findById(propertyId)
      .populate('agent', 'name email');

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if the agent owns this property
    if (property.agent._id.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only view your own properties" 
      });
    }

    res.status(200).json({
      success: true,
      property: property
    });

  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ 
      error: "Failed to get property",
      details: error.message 
    });
  }
};

// Update property (Agent can only update their own properties)
exports.updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();
    const agentId = req.user.userId;

    // Validate ObjectId format
    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID format" 
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if the agent owns this property
    if (property.agent.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only update your own properties" 
      });
    }

    // Parse and update fields (including location, features, amenities if sent as JSON strings)
    const updateFields = ['title', 'description', 'price', 'propertyType', 'status'];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    if (req.body.location) {
      property.location = typeof req.body.location === 'string'
        ? JSON.parse(req.body.location)
        : req.body.location;
    }

    if (req.body.features) {
      property.features = typeof req.body.features === 'string'
        ? JSON.parse(req.body.features)
        : req.body.features;
    }

    if (req.body.amenities) {
      property.amenities = typeof req.body.amenities === 'string'
        ? JSON.parse(req.body.amenities)
        : req.body.amenities;
    }

    // Handle image deletion
    if (req.body.deleteImages) {
      const deleteImages = typeof req.body.deleteImages === 'string'
        ? JSON.parse(req.body.deleteImages)
        : req.body.deleteImages;
      if (Array.isArray(deleteImages) && deleteImages.length > 0) {
        // Filter out images to delete
        property.images = property.images.filter(img => !deleteImages.includes(img));
      }
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      property.images = [...property.images, ...newImages];
    }

    await property.save();

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: {
        id: property._id,
        title: property.title,
        price: property.price,
        location: property.location,
        propertyType: property.propertyType,
        amenities: property.amenities,
        features: property.features,
        status: property.status,
        images: property.images, // Include updated images in response
        updatedAt: property.updatedAt
      }
    });

  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ 
      error: "Failed to update property",
      details: error.message 
    });
  }
};


// Delete property (Agent can only delete their own properties)
exports.deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();
    const agentId = req.user.userId;

    // Validate ObjectId format
    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID format" 
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if the agent owns this property
    if (property.agent.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only delete your own properties" 
      });
    }

    // Check if user wants hard delete (query parameter)
    if (req.query.hardDelete === 'true') {
      // Hard delete - actually remove from database
      await Property.findByIdAndDelete(propertyId);
      console.log("Property hard deleted:", propertyId);
    } else {
      // Soft delete by setting isActive to false
      property.isActive = false;
      await property.save();
      console.log("Property soft deleted:", propertyId);
    }

    res.status(200).json({
      success: true,
      message: req.query.hardDelete === 'true' ? "Property permanently deleted" : "Property deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ 
      error: "Failed to delete property",
      details: error.message 
    });
  }
};

// Restore soft-deleted property
exports.restoreProperty = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();
    const agentId = req.user.userId;

    // Validate ObjectId format
    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID format" 
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if the agent owns this property
    if (property.agent.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only restore your own properties" 
      });
    }

    // Check if property is already active
    if (property.isActive) {
      return res.status(400).json({ 
        error: "Property is already active" 
      });
    }

    // Restore property by setting isActive to true
    property.isActive = true;
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property restored successfully",
      property: {
        id: property._id,
        title: property.title,
        status: property.status,
        isActive: property.isActive
      }
    });

  } catch (error) {
    console.error("Error restoring property:", error);
    res.status(500).json({ 
      error: "Failed to restore property",
      details: error.message 
    });
  }
};


// controllers/propertyController.js

// Get properties by type (public)
exports.getPropertiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { city, minPrice, maxPrice } = req.query;

    // Validate propertyType enum
    const allowedTypes = ["house", "apartment", "office", "townhouse", "villa"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid property type" });
    }

    // Build filter
    const filter = {
      propertyType: type,
      isActive: true,
      status: { $in: ["rented", "available"] } // ✅ only rented & available
    };

    if (city) filter["location.city"] = city;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const properties = await Property.find(filter)
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });

  } catch (error) {
    console.error("Error getting properties by type:", error);
    res.status(500).json({
      error: "Failed to get properties by type",
      details: error.message
    });
  }
};


// controllers/propertyController.js
//property counts
exports.getPropertyTypeCounts = async (req, res) => {
  try {
    const { city } = req.query;

    // Always enforce active + rented/available
    const filter = { 
      isActive: true,
      status: { $in: ["rented", "available"] }
    };

    if (city) {
      filter["location.city"] = city;
    }

    const counts = await Property.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$propertyType",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          propertyType: "$_id",
          count: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      counts
    });

  } catch (error) {
    console.error("Error getting property type counts:", error);
    res.status(500).json({
      error: "Failed to get property type counts",
      details: error.message
    });
  }
};

//city counts
// controllers/propertyController.js

exports.getCityCounts = async (req, res) => {
  try {
    const { type } = req.query;

    // Always include only active + rented/available
    const filter = { 
      isActive: true,
      status: { $in: ["rented", "available"] }
    };

    if (type) {
      filter.propertyType = type;
    }

    const counts = await Property.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$location.city",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          city: "$_id",
          count: 1
        }
      },
      { $sort: { count: -1 } } // sort by most properties
    ]);

    res.status(200).json({
      success: true,
      counts
    });

  } catch (error) {
    console.error("Error getting city counts:", error);
    res.status(500).json({
      error: "Failed to get city counts",
      details: error.message
    });
  }
};

// City type
exports.getPropertiesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { type, minPrice, maxPrice } = req.query;

    // Always filter for active properties in the city
    const filter = { 
      isActive: true, 
      "location.city": city,
      status: { $in: ["rented", "available"] } // ✅ Only rented & available
    };

    if (type) filter.propertyType = type;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const properties = await Property.find(filter)
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error("Error getting properties by city:", error);
    res.status(500).json({
      error: "Failed to get properties by city",
      details: error.message
    });
  }
};


// Search properties (public)

// controllers/propertyController.js
exports.searchProperties = async (req, res) => {
  try {
    const {
      city,
      type,
      minPrice,
      maxPrice,
      keyword,
      bedrooms,
      bathrooms,
      amenities, // expected as comma-separated string, e.g., "parking,swimmingPool,wifi"
      yearBuilt,
      area
    } = req.query;

    // Always enforce active + rented/available
    const filter = { 
      isActive: true,
      status: { $in: ["rented", "available"] }
    };

    if (city) filter["location.city"] = { $regex: city, $options: "i" }; // Case-insensitive city search
    if (type) filter.propertyType = type;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (bedrooms) filter["features.bedrooms"] = { $gte: Number(bedrooms) };
    if (bathrooms) filter["features.bathrooms"] = { $gte: Number(bathrooms) };
    if (yearBuilt) filter["features.yearBuilt"] = { $gte: Number(yearBuilt) };
    if (area) filter["features.area"] = { $gte: Number(area) };
    if (amenities) {
      const amenitiesArray = amenities.split(",").map(a => a.trim());
      amenitiesArray.forEach(a => {
        filter[`amenities.${a}`] = true;
      });
    }
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    const properties = await Property.find(filter)
      .select("title description propertyType status price location features amenities images isActive createdAt agent")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({
      error: "Failed to search properties",
      details: error.message
    });
  }
};


// Get all active properties from all agents (public)
exports.getAllProperties = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const properties = await Property.find(
      { isActive: true },
      "title description price location features images propertyType status agent createdAt"
    )
      .populate("agent", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Map properties to flatten the features for easier frontend use
    const formattedProperties = properties.map((p) => ({
      ...p.toObject(),
      beds: p.features?.bedrooms || 0,
      baths: p.features?.bathrooms || 0,
      area: p.features?.area || 0,
    }));

    res.status(200).json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    });
  } catch (error) {
    console.error("Error getting all properties:", error);
    res.status(500).json({
      error: "Failed to get properties",
      details: error.message,
    });
  }
};

exports.getPropertiesByStatus = async (req, res) => {
  try {
    const { status } = req.params; // "available" or "rented"
    console.log("Fetching properties for status:", status, "from IP:", req.ip); // Debug log

    // Validate status
    const validStatuses = ["available", "rented"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Use '${validStatuses.join("' or '")}'.` });
    }

    // Filter only active properties with the given status
    const filter = { isActive: true, status };

    const properties = await Property.find(filter)
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    console.log("Found properties:", properties.length); // Debug log
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties by status:", error);
    res.status(500).json({
      error: "Failed to fetch properties",
      details: error.message,
    });
  }
};


// Get property by ID (public)
exports.getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();

    // Validate ObjectId format
    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID format" 
      });
    }

    const property = await Property.findOne({ _id: propertyId, isActive: true })
      .populate('agent', 'name email');

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({
      success: true,
      property
    });

  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ 
      error: "Failed to get property",
      details: error.message 
    });
  }
};

// controllers/propertyController.js

// Compare properties by IDs (public)
// Compare properties (public)
exports.compareProperties = async (req, res) => {
  try {
    const { ids } = req.query; // comma-separated property IDs, e.g., /properties/compare?ids=123,456

    if (!ids) {
      return res.status(400).json({ error: "Property IDs are required" });
    }

    const idArray = ids.split(",").map(id => id.trim()).filter(id => id.length === 24);

    if (idArray.length < 2) {
      return res.status(400).json({ error: "At least 2 valid property IDs are required" });
    }

    const properties = await Property.find({ 
      _id: { $in: idArray },
      isActive: true
    })
    .select("title description price location features amenities images propertyType status createdAt")
    .populate("agent", "name email");

    if (!properties || properties.length < 2) {
      return res.status(404).json({ error: "Not enough properties found for comparison" });
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error("Error comparing properties:", error);
    res.status(500).json({
      error: "Failed to compare properties",
      details: error.message
    });
  }
};

//feature properties
// ✅ Get only featured properties (strict server-side gating via aggregation)
exports.getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const now = new Date();

    const pipeline = [
      {
        $match: {
          isActive: true,
          isFeatured: true,
          status: { $in: ["available", "rented"] }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "agent",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: "$agent" },
      {
        $match: {
          "agent.hasSubscription": true,
          "agent.subscriptionExpiry": { $gt: now }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          location: 1,
          features: 1,
          images: 1,
          propertyType: 1,
          status: 1,
          isFeatured: 1,
          createdAt: 1,
          agent: {
            _id: "$agent._id",
            name: "$agent.name",
            email: "$agent.email",
            hasSubscription: "$agent.hasSubscription",
            subscriptionExpiry: "$agent.subscriptionExpiry"
          }
        }
      }
    ];

    const docs = await Property.aggregate(pipeline);

    const formattedProperties = docs.map((p) => ({
      ...p,
      beds: p.features?.bedrooms || 0,
      baths: p.features?.bathrooms || 0,
      area: p.features?.area || 0,
    }));

    res.status(200).json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    });
  } catch (error) {
    console.error("Error getting featured properties:", error);
    res.status(500).json({
      error: "Failed to get featured properties",
      details: error.message,
    });
  }
};


