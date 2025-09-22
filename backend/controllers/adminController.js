// controllers/adminController.js
const User = require("../models/User");
const Property = require("../models/Property");

// Get all users and agents
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "agent"] } }).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // Clean and validate the ID
    const userId = req.params.id.trim();
    console.log("Looking for user with ID:", userId);
    
    // Validate ObjectId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid user ID format",
        providedId: req.params.id,
        cleanedId: userId
      });
    }
    
    const user = await User.findById(userId).select('-password');
    console.log("Found user:", user);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ 
      error: "Error retrieving user",
      details: error.message,
      userId: req.params.id.trim()
    });
  }
};

// Approve agent
exports.approveAgent = async (req, res) => {
  try {
    // Clean and validate the ID
    const agentId = req.params.id.trim();
    console.log("Approving agent with ID:", agentId);
    
    // Validate ObjectId format
    if (!agentId || agentId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid agent ID format",
        providedId: req.params.id,
        cleanedId: agentId
      });
    }
    
    let agent = await User.findById(agentId);
    console.log("Found agent:", agent);
    
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    
    if (agent.role !== "agent") {
      return res.status(400).json({ 
        error: "User is not an agent", 
        userRole: agent.role,
        userId: agent._id 
      });
    }

    if (agent.isApproved) {
      return res.status(400).json({ 
        error: "Agent is already approved",
        agentId: agent._id,
        agentName: agent.name
      });
    }

    // Try method 1: Update the object and save
    try {
      agent.isApproved = true;
      await agent.save();
      console.log("Agent approved successfully using save():", agent.name);
    } catch (saveError) {
      console.log("Save method failed, trying findByIdAndUpdate...");
      // Try method 2: Use findByIdAndUpdate
      const updatedAgent = await User.findByIdAndUpdate(
        agentId,
        { isApproved: true },
        { new: true, runValidators: true }
      );
      
      if (!updatedAgent) {
        throw new Error("Failed to update agent");
      }
      
      agent = updatedAgent;
      console.log("Agent approved successfully using findByIdAndUpdate():", agent.name);
    }
    
    res.status(200).json({ 
      success: true,
      message: "Agent approved successfully",
      user: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        isApproved: agent.isApproved
      }
    });
  } catch (error) {
    console.error("Error in approveAgent:", error);
    res.status(500).json({ 
      error: "Failed to approve agent",
      details: error.message,
      agentId: req.params.id.trim()
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    
    // Validate ObjectId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid user ID format",
        providedId: req.params.id,
        cleanedId: userId
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin users" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    
    // Validate ObjectId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid user ID format",
        providedId: req.params.id,
        cleanedId: userId
      });
    }
    
    const { name, email, role, isApproved } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot modify admin users" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isApproved === 'boolean') user.isApproved = isApproved;

    await user.save();
    
    res.status(200).json({ 
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Get admin dashboard stats
// controllers/adminController.js (or wherever this function is defined)

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAgents = await User.countDocuments({ role: "agent" });
    const approvedAgents = await User.countDocuments({ role: "agent", isApproved: true });
    const pendingAgents = await User.countDocuments({ role: "agent", isApproved: false });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalProperties = await Property.countDocuments(); // ✅ Include properties

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAgents,
        approvedAgents,
        pendingAgents,
        totalAdmins,
        totalProperties,
        totalUsers: totalUsers + totalAgents // optional: overwrite or rename this field
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Error retrieving dashboard stats" });
  }
};
 

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: { $in: ["available", "rented"] }   // 👈 filter here
    }).populate(
      "agent",
      "name email hasSubscription subscriptionExpiry isApproved"
    );

    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve properties" });
  }
};


// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Property not found" });

    res.status(200).json({ success: true, message: "Property updated", property: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
};
// Feature or unfeature a property
exports.featureProperty = async (req, res) => {
  try {
    const propertyId = req.params.id.trim();

    if (!propertyId || propertyId.length !== 24) {
      return res.status(400).json({ 
        error: "Invalid property ID format",
        providedId: req.params.id,
        cleanedId: propertyId
      });
    }

    // Get "isFeatured" flag from body
    const { isFeatured } = req.body;

    const property = await Property.findById(propertyId).populate("agent", "hasSubscription subscriptionExpiry name email");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // If setting featured=true, enforce that the agent has an active paid subscription
    if (isFeatured === true) {
      const agent = property.agent;
      const hasValidSub = !!(agent && agent.hasSubscription && agent.subscriptionExpiry && new Date(agent.subscriptionExpiry) > new Date());
      if (!hasValidSub) {
        return res.status(403).json({
          error: "Agent does not have an active subscription. Cannot mark as featured."
        });
      }
    }

    property.isFeatured = isFeatured; // true or false
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${isFeatured ? "marked as featured" : "removed from featured"}`,
      property
    });
  } catch (error) {
    console.error("Error in featureProperty:", error);
    res.status(500).json({ error: "Failed to update property feature status" });
  }
};// Get featured properties only
// controllers/adminController.js







