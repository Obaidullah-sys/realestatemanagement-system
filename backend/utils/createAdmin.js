const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/backend-chat");
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists with email:", existingAdmin.email);
      console.log("If you want to create a new admin, please delete the existing one first.");
      return;
    }

    // Admin credentials (you can modify these or use environment variables)
    const adminData = {
      name: process.env.ADMIN_NAME || "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      isApproved: true
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      isApproved: adminData.isApproved
    });

    await admin.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("👤 Role:", adminData.role);
    console.log("\n⚠️  Please change the password after first login!");
    
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Function to create admin with custom data
const createCustomAdmin = async (name, email, password) => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/backend-chat");
    console.log("Connected to MongoDB");

    // Check if admin with this email already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin with this email already exists:", email);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isApproved: true
    });

    await admin.save();
    
    console.log("✅ Custom admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("👤 Name:", name);
    console.log("🔑 Password:", password);
    
  } catch (error) {
    console.error("❌ Error creating custom admin:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Check command line arguments
const args = process.argv.slice(2);

if (args.length === 3) {
  // Create admin with custom data: node createAdmin.js "Admin Name" "admin@email.com" "password"
  const [name, email, password] = args;
  createCustomAdmin(name, email, password);
} else {
  // Create admin with default or environment variables
  createAdmin();
}
