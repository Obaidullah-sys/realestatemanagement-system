const Tour = require("../models/Tour");
const Property = require("../models/Property");
const User = require("../models/User");
const Message = require("../models/Message");
const mongoose = require("mongoose");
// Public: Schedule a tour (Website visitors)
exports.scheduleTour = async (req, res) => {
  try {
    const { name, email, phone, message, tourDate, tourTime, propertyId } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !tourDate || !tourTime || !propertyId) {
      return res.status(400).json({ 
        error: "Please fill in all required fields: name, email, phone, tour date, tour time, and property ID" 
      });
    }

    // Check if property exists and is active
    const property = await Property.findById(propertyId).populate('agent', 'name email phone');
    if (!property || !property.isActive) {
      return res.status(404).json({ 
        error: "Property not found or no longer available" 
      });
    }

    // ✅ Allow tours for both "available" and "rented" properties
    if (!["available", "rented"].includes(property.status)) {
      return res.status(400).json({ 
        error: "This property is not available for tours at the moment" 
      });
    }

    // Check if the requested date is in the future
    const requestedDate = new Date(tourDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      return res.status(400).json({ 
        error: "Tour date must be in the future" 
      });
    }

    // Create new tour
    const tour = new Tour({
      name,
      email,
      phone,
      message: message || "",
      tourDate: requestedDate,
      tourTime,
      property: propertyId,
      agent: property.agent._id
    });

    await tour.save();

    // Create initial message if provided
    if (message && message.trim()) {
      const initialMessage = new Message({
        tour: tour._id,
        sender: "user",
        senderId: null, // guest user
        receiverId: property.agent._id,
        message: message.trim()
      });
      await initialMessage.save();
    }

    res.status(201).json({
      success: true,
      message: "Tour scheduled successfully! We'll contact you soon to confirm.",
      tour: {
        id: tour._id,
        name: tour.name,
        email: tour.email,
        phone: tour.phone,
        tourDate: tour.tourDate,
        tourTime: tour.tourTime,
        status: tour.status,
        property: {
          id: property._id,
          title: property.title,
          address: `${property.location.address}, ${property.location.city}, ${property.location.state}`,
          price: property.price
        },
        agent: {
          name: property.agent.name,
          email: property.agent.email,
          phone: property.agent.phone
        },
        initialMessage: message || null
      }
    });

  } catch (error) {
    console.error("Error scheduling tour:", error);
    res.status(500).json({ 
      error: "Failed to schedule tour. Please try again.",
      details: error.message 
    });
  }
};


// Public: Get available properties for tour scheduling
exports.getAvailableProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, propertyType, minPrice, maxPrice, city } = req.query;

    // Build filter for available properties
    const filter = { 
      isActive: true, 
      status: "available" 
    };

    if (propertyType) filter.propertyType = propertyType;
    if (minPrice) filter.price = { $gte: parseInt(minPrice) };
    if (maxPrice) {
      if (filter.price) {
        filter.price.$lte = parseInt(maxPrice);
      } else {
        filter.price = { $lte: parseInt(maxPrice) };
      }
    }
    if (city) filter["location.city"] = { $regex: city, $options: 'i' };

    const properties = await Property.find(filter)
      .populate('agent', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: properties.length,
      totalProperties: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      properties: properties.map(property => ({
        id: property._id,
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        propertyType: property.propertyType,
        features: property.features,
        images: property.images,
        agent: {
          name: property.agent.name,
          email: property.agent.email,
          phone: property.agent.phone
        },
        createdAt: property.createdAt
      }))
    });

  } catch (error) {
    console.error("Error getting available properties:", error);
    res.status(500).json({ 
      error: "Failed to get properties",
      details: error.message 
    });
  }
};

// Public: Get specific property details for tour scheduling
exports.getPropertyForTour = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();

    // Validate ObjectId format
    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID" 
      });
    }

    const property = await Property.findById(propertyId)
      .populate('agent', 'name email phone');

    if (!property || !property.isActive) {
      return res.status(404).json({ 
        error: "Property not found or no longer available" 
      });
    }

    if (property.status !== "available") {
      return res.status(400).json({ 
        error: "This property is not available for tours at the moment" 
      });
    }

    res.status(200).json({
      success: true,
      property: {
        id: property._id,
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        propertyType: property.propertyType,
        features: property.features,
        images: property.images,
        agent: {
          name: property.agent.name,
          email: property.agent.email,
          phone: property.agent.phone
        },
        createdAt: property.createdAt
      }
    });

  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ 
      error: "Failed to get property details",
      details: error.message 
    });
  }
};

// Get agent's tours
exports.getMyTours = async (req, res) => {
  try {
    const agentId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Verify the user is an approved agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent" || !agent.isApproved) {
      return res.status(403).json({ 
        error: "Only approved agents can view tours" 
      });
    }

    // Build filter
    const filter = { agent: agentId, isActive: true };
    if (status) {
      filter.status = status;
    }

    const tours = await Tour.find(filter)
      .populate('property', 'title location price')
      .sort({ tourDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tour.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tours.length,
      totalTours: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      tours: tours.map(tour => ({
        id: tour._id,
        name: tour.name,
        email: tour.email,
        phone: tour.phone,
        message: tour.message,
        tourDate: tour.tourDate,
        tourTime: tour.tourTime,
        status: tour.status,
        property: tour.property,
        createdAt: tour.createdAt
      }))
    });

  } catch (error) {
    console.error("Error getting tours:", error);
    res.status(500).json({ 
      error: "Failed to get tours",
      details: error.message 
    });
  }
};

// Get tour by ID (Agent can only see their own tours)
exports.getTourById = async (req, res) => {
  try {
    const tourId = req.params.id.trim();
    const agentId = req.user.userId;

    // Validate ObjectId format
    if (!tourId || tourId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid tour ID format" 
      });
    }

    const tour = await Tour.findById(tourId)
      .populate('property', 'title location price features')
      .populate('agent', 'name email phone');

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Check if the agent owns this tour
    if (tour.agent._id.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only view your own tours" 
      });
    }

    res.status(200).json({
      success: true,
      tour: {
        id: tour._id,
        name: tour.name,
        email: tour.email,
        phone: tour.phone,
        message: tour.message,
        tourDate: tour.tourDate,
        tourTime: tour.tourTime,
        status: tour.status,
        property: tour.property,
        agent: tour.agent,
        createdAt: tour.createdAt,
        updatedAt: tour.updatedAt
      }
    });

  } catch (error) {
    console.error("Error getting tour:", error);
    res.status(500).json({ 
      error: "Failed to get tour",
      details: error.message 
    });
  }
};

// Update tour status (Agent can only update their own tours)
exports.updateTourStatus = async (req, res) => {
  try {
    const tourId = req.params.id.trim();
    const agentId = req.user.userId;
    const { status } = req.body;

    // Validate ObjectId format
    if (!tourId || tourId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid tour ID format" 
      });
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be one of: pending, confirmed, completed, cancelled" 
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Check if the agent owns this tour
    if (tour.agent.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only update your own tours" 
      });
    }

    tour.status = status;
    await tour.save();

    res.status(200).json({
      success: true,
      message: "Tour status updated successfully",
      tour: {
        id: tour._id,
        status: tour.status,
        updatedAt: tour.updatedAt
      }
    });

  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ 
      error: "Failed to update tour",
      details: error.message 
    });
  }
};

// Get tour statistics for agent
exports.getTourStats = async (req, res) => {
  try {
    const agentId = req.user.userId;
    
    // Verify the user is an approved agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent" || !agent.isApproved) {
      return res.status(403).json({ 
        error: "Only approved agents can view tour statistics" 
      });
    }

    const stats = await Tour.aggregate([
      { $match: { agent: agent._id, isActive: true } },
      {
        $group: {
          _id: null,
          totalTours: { $sum: 1 },
          pendingTours: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          confirmedTours: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
          },
          completedTours: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          cancelledTours: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          }
        }
      }
    ]);

    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthlyStats = await Tour.aggregate([
      { 
        $match: { 
          agent: agent._id, 
          isActive: true,
          createdAt: { $gte: thisMonth }
        } 
      },
      {
        $group: {
          _id: null,
          toursThisMonth: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalTours: 0,
        pendingTours: 0,
        confirmedTours: 0,
        completedTours: 0,
        cancelledTours: 0
      },
      monthlyStats: monthlyStats[0] || { toursThisMonth: 0 }
    });

  } catch (error) {
    console.error("Error getting tour stats:", error);
    res.status(500).json({ 
      error: "Failed to get tour statistics",
      details: error.message 
    });
  }
};

// Admin: Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, agentId } = req.query;

    // Build filter
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (agentId) filter.agent = agentId;

    const tours = await Tour.find(filter)
      .populate('property', 'title location price')
      .populate('agent', 'name email')
      .sort({ tourDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tour.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tours.length,
      totalTours: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      tours: tours
    });

  } catch (error) {
    console.error("Error getting all tours:", error);
    res.status(500).json({ 
      error: "Failed to get tours",
      details: error.message 
    });
  }
}; 

