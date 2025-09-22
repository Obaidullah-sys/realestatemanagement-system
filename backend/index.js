require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const tourRoutes = require("./routes/tourRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const subscriptionRoutes = require("./routes/subscription");
const webhookRoutes = require("./routes/webhook");
require("./utils/subscriptionReminder"); // start cron

const app = express();
// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Do NOT use "*"
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // ✅ Add all allowed methods
  credentials: true, // ✅ Allow cookies & Authorization headers
  allowedHeaders: ['Content-Type', 'Authorization'] // ✅ Required for preflight requests
}));

// Security middlewares
app.use(helmet());
//app.use(rateLimit({
  //windowMs: 15 * 60 * 1000, // 15 minutes
  //max: 1000 // limit each IP to 100 requests per windowMs
//}));



// Webhook must receive raw body BEFORE json parser
app.use("/api/stripe", webhookRoutes);

// Middleware
app.use(express.json());
// ✅ Serve static files from /uploads with correct headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);       // For user & agent
app.use("/api/admin", adminRoutes);      // For admin operations
app.use("/api/properties", propertyRoutes); // For property management
app.use("/api/tours", tourRoutes);       // For tour scheduling
app.use("/api/messages", messageRoutes); // For messaging system
app.use("/api/reviews", reviewRoutes);  // For property reviews
// Routes already mounted for webhook above
app.use("/api/subscription", subscriptionRoutes);
// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
