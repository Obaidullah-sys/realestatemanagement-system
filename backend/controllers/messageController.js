const Message = require("../models/Message");
const Tour = require("../models/Tour");

// User sends additional message to existing tour
exports.userSendMessage = async (req, res) => {
  try {
    const { tourId, message } = req.body;

    if (!tourId || !message) {
      return res.status(400).json({ 
        error: "Tour ID and message are required" 
      });
    }

    // Find the tour
    const tour = await Tour.findById(tourId)
      .populate('agent', 'name email');

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Create additional message from user
    const newMessage = new Message({
      tour: tourId,
      sender: "user",
      senderId: null, // No user account needed
      receiverId: tour.agent._id,
      message: message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: {
        tourId: tourId,
        agentName: tour.agent.name,
        agentEmail: tour.agent.email
      }
    });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ 
      error: "Failed to send message",
      details: error.message 
    });
  }
};

// Agent replies to user's tour request
exports.agentReply = async (req, res) => {
  try {
    const { tourId, message } = req.body;
    const agentId = req.user.userId;

    if (!tourId || !message) {
      return res.status(400).json({ 
        error: "Tour ID and message are required" 
      });
    }

    // Find the tour and verify agent owns it
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    if (tour.agent.toString() !== agentId) {
      return res.status(403).json({ 
        error: "You can only reply to your own tours" 
      });
    }

    // Create agent's reply
    const newMessage = new Message({
      tour: tourId,
      sender: "agent",
      senderId: agentId,
      receiverId: null, // No specific user account
      message: message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: {
        messageId: newMessage._id,
        tourId: tourId
      }
    });

  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ 
      error: "Failed to send reply",
      details: error.message 
    });
  }
};

// Get all messages for a tour (for both user and agent)
exports.getTourMessages = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const { name, email } = req.query; // For user verification
    const agentId = req.user?.userId; // For agent verification

    // Find the tour
    const tour = await Tour.findById(tourId)
      .populate('agent', 'name email');

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Verify access - either user (by name/email) or agent (by token)
    let hasAccess = false;
    
    if (agentId && tour.agent._id.toString() === agentId) {
      // Agent access
      hasAccess = true;
    } else if (name && email && tour.name === name && tour.email === email) {
      // User access
      hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({ 
        error: "Access denied" 
      });
    }

    // Get all messages for this tour
    const messages = await Message.find({ 
      tour: tourId, 
      isActive: true 
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      tour: {
        id: tour._id,
        name: tour.name,
        email: tour.email,
        phone: tour.phone,
        tourDate: tour.tourDate,
        tourTime: tour.tourTime,
        status: tour.status,
        agent: {
          name: tour.agent.name,
          email: tour.agent.email
        }
      },
      messages: messages.map(msg => ({
        id: msg._id,
        sender: msg.sender,
        message: msg.message,
        createdAt: msg.createdAt
      }))
    });

  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ 
      error: "Failed to get messages",
      details: error.message 
    });
  }
};

// Agent gets all their tours with messages
exports.getAgentTours = async (req, res) => {
  try {
    const agentId = req.user.userId;

    // Get all tours for this agent
    const tours = await Tour.find({ 
      agent: agentId, 
      isActive: true 
    })
    .populate('property', 'title location price')
    .sort({ createdAt: -1 });

    // Get message count for each tour
    const toursWithMessages = await Promise.all(
      tours.map(async (tour) => {
        const messageCount = await Message.countDocuments({ 
          tour: tour._id, 
          isActive: true 
        });
        
        const unreadCount = await Message.countDocuments({ 
          tour: tour._id, 
          isActive: true,
          isRead: false,
          sender: "user"
        });

        return {
          id: tour._id,
          name: tour.name,
          email: tour.email,
          phone: tour.phone,
          tourDate: tour.tourDate,
          tourTime: tour.tourTime,
          status: tour.status,
          property: tour.property,
          messageCount,
          unreadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      tours: toursWithMessages
    });

  } catch (error) {
    console.error("Error getting agent tours:", error);
    res.status(500).json({ 
      error: "Failed to get tours",
      details: error.message 
    });
  }
};

// Mark messages as read (for agent)
exports.markAsRead = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const agentId = req.user.userId;

    // Verify tour ownership
    const tour = await Tour.findById(tourId);
    if (!tour || tour.agent.toString() !== agentId) {
      return res.status(403).json({ 
        error: "Access denied" 
      });
    }

    // Mark all unread user messages as read
    await Message.updateMany(
      { 
        tour: tourId, 
        sender: "user", 
        isRead: false,
        isActive: true 
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read"
    });

  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ 
      error: "Failed to mark messages as read",
      details: error.message 
    });
  }
};

// In messageController.js
exports.getUserTours = async (req, res) => {
  try {
    const { name, email } = req.query;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Find all tours for this user
    const tours = await Tour.find({ name, email, isActive: true })
      .populate("agent", "name email")
      .populate("property", "title location price")
      .sort({ createdAt: -1 });

    if (!tours.length) {
      return res.status(404).json({ error: "No tours found for this user" });
    }

    res.status(200).json({
      success: true,
      tours: tours.map((tour) => ({
        id: tour._id,
        property: tour.property,
        tourDate: tour.tourDate,
        tourTime: tour.tourTime,
        status: tour.status,
        agent: tour.agent,
      })),
    });
  } catch (error) {
    console.error("Error getting user tours:", error);
    res.status(500).json({ error: "Failed to get tours" });
  }
};
