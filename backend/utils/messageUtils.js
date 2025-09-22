const Message = require("../models/Message");
const Tour = require("../models/Tour");

// Utility function to validate tour ownership
exports.validateTourOwnership = async (tourId, agentId) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }
  if (tour.agent.toString() !== agentId) {
    throw new Error("Access denied: You don't own this tour");
  }
  return tour;
};

// Utility function to validate user tour access
exports.validateUserTourAccess = async (tourId, name, email) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }
  if (tour.name !== name || tour.email !== email) {
    throw new Error("Access denied: Invalid credentials");
  }
  return tour;
};

// Utility function to get message statistics
exports.getMessageStats = async (tourId) => {
  const totalMessages = await Message.countDocuments({ 
    tour: tourId, 
    isActive: true 
  });
  
  const unreadMessages = await Message.countDocuments({ 
    tour: tourId, 
    isActive: true,
    isRead: false,
    sender: "user"
  });

  const lastMessage = await Message.findOne({ 
    tour: tourId, 
    isActive: true 
  }).sort({ createdAt: -1 });

  return {
    totalMessages,
    unreadMessages,
    lastMessage: lastMessage ? {
      message: lastMessage.message,
      sender: lastMessage.sender,
      createdAt: lastMessage.createdAt
    } : null
  };
};

// Utility function to format message response
exports.formatMessageResponse = (message) => {
  return {
    id: message._id,
    sender: message.sender,
    message: message.message,
    isRead: message.isRead,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt
  };
};

// Utility function to format tour with messages
exports.formatTourWithMessages = (tour, messageStats) => {
  return {
    id: tour._id,
    name: tour.name,
    email: tour.email,
    phone: tour.phone,
    tourDate: tour.tourDate,
    tourTime: tour.tourTime,
    status: tour.status,
    property: tour.property,
    messageStats,
    createdAt: tour.createdAt
  };
}; 