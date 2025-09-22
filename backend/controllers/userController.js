const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Property = require("../models/Property");
const mongoose = require("mongoose");
const {sendWelcomeEmail} = require("../utils/sendMail");
const sendResetEmail = require("../utils/sendResetEmail"); // import your email util

let refreshTokens = []; // In-memory store (replace with DB/Redis in production)

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Check password length
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : null,
      isApproved: role === "agent" ? false : true,
    });

    await newUser.save();

    // ✅ Send welcome email after successful registration
    try {
      await sendWelcomeEmail(newUser.email, newUser.name);
    } catch (emailErr) {
      console.error("⚠️ Failed to send welcome email:", emailErr.message);
      // Not blocking registration if email fails
    }

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.role === "agent" && !user.isApproved) {
      return res.status(403).json({ error: "Agent account not yet approved" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key"
    );
    refreshTokens.push(refreshToken);

    res.json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    refreshTokens = refreshTokens.filter(t => t !== refreshToken);
    const newToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key"
    );
    refreshTokens.push(newRefreshToken);

    res.json({
      message: "Token refreshed successfully",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  });
};

exports.logout = (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    refreshTokens = refreshTokens.filter(t => t !== refreshToken);
  }
  res.status(200).json({ message: "Logout successful. Please remove token from client side." });
};



exports.getPublicAgents = async (req, res) => {
  try {
    // Fetch approved agents
    const agents = await User.find({ role: "agent", isApproved: true })
      .select("name profileImage");

    // For each agent, count properties
    const agentsWithCounts = await Promise.all(
      agents.map(async (agent) => {
        const propertyCount = await Property.countDocuments({ agent: agent._id });
        return {
          _id: agent._id,
          name: agent.name,
          profileImage: agent.profileImage,
          propertyCount,
        };
      })
    );

    res.json(agentsWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.approveAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Agent approved", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from authMiddleware
    const { name, email, password, role } = req.body;

    const updateData = {
      name,
      email,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.addFavourite = async (req, res) => {
  try {
    const userId = req.user.userId; // from authMiddleware
    const { propertyId } = req.body;

    console.log("Adding favourite:", { userId, propertyId }); // Debug log
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: "Invalid property ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadyFav = user.favourites.some((fav) => fav.toString() === propertyId);
    if (alreadyFav) {
      return res.status(400).json({ error: "Property already in favourites" });
    }

    user.favourites.push(propertyId);
    await user.save();

    res.json({ message: "Property added to favourites", favourites: user.favourites });
  } catch (err) {
    console.error("Error adding favourite:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavourite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { propertyId } = req.body;

    console.log("Removing favourite:", { userId, propertyId }); // Debug log
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: "Invalid property ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favourites = user.favourites.filter((fav) => fav.toString() !== propertyId);
    await user.save();

    res.json({ message: "Property removed from favourites", favourites: user.favourites });
  } catch (err) {
    console.error("Error removing favourite:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("Fetching favourites for user:", userId); // Debug log
    const user = await User.findById(userId).populate("favourites");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ favourites: user.favourites });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    // Generate reset token valid for 1 hour
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Send reset email
    await sendResetEmail(user.email, resetToken);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // from URL
    const { password } = req.body; // new password from frontend

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
