const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "agent", "admin"],
    default: "user"
  },
  isApproved: { type: Boolean, default: false },
  profileImage: { type: String }, // stores filename
   favourites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Property" } // <-- Add this
  ],
    // ✅ Subscription fields
  hasSubscription: { type: Boolean, default: false },
  subscriptionExpiry: { type: Date },
  stripeCustomerId: String,
  stripeSubscriptionId: String,

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
