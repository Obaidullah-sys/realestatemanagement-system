const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  isFeatured: { type: Boolean, default: false },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  propertyType: {
    type: String,
    enum: ["house", "apartment", "office", "townhouse", "villa"],
    required: true
  },
  status: {
    type: String,
    enum: ["available", "sold", "pending", "rented"],
    default: "available"
  },
  features: {
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    area: { type: Number, min: 0 }, // in square feet
    yearBuilt: { type: Number },
   
  },
   amenities: {
    parking: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    barbeque: { type: Boolean, default: false },
    dryer: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    lawn: { type: Boolean, default: false },
    microwave: { type: Boolean, default: false },
    outdoorShower: { type: Boolean, default: false },
    refrigerator: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    tvCable: { type: Boolean, default: false },
    washer: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    garage: { type: Boolean, default: false }
  },
  images: [{ 
    type: String // array of image filenames
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for better query performance
propertySchema.index({ agent: 1, status: 1 });
propertySchema.index({ location: 1 });
propertySchema.index({ price: 1 });

module.exports = mongoose.model("Property", propertySchema);