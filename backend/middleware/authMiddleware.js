const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Validate ObjectId
    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ message: "Invalid user ID in token" });
    }

    const user = await User.findById(decoded.userId).select("_id role isApproved");
    if (!user) return res.status(403).json({ message: "Invalid user" });

    // Attach _id, role, and approval to req.user
    req.user = { userId: user._id.toString(), role: user.role, isApproved: user.isApproved };

    next();
  } catch (err) {
    console.error("Auth error:", err.name, err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

module.exports = authMiddleware;
module.exports.isAdmin = isAdmin;
