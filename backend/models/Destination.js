const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Hill Station', 'Wildlife', 'Adventure', 'Religious', 'Nature', 'City', 'Cultural', 'Historical']
  },
  location: {
    address: String,
    city: String,
    district: String,
    state: { type: String, default: 'Jharkhand' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    nearbyPlaces: [String]
  },
  images: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  highlights: [String],
  activities: [{
    name: String,
    description: String,
    duration: String,
    price: Number,
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] }
  }],
  bestTimeToVisit: {
    months: [String],
    weather: String,
    temperature: {
      min: Number,
      max: Number
    }
  },
  accessibility: {
    byRoad: { type: Boolean, default: true },
    byRail: { type: Boolean, default: false },
    byAir: { type: Boolean, default: false },
    nearestRailway: String,
    nearestAirport: String,
    roadCondition: String
  },
  facilities: {
    accommodation: [String],
    restaurants: [String],
    parking: { type: Boolean, default: false },
    restrooms: { type: Boolean, default: false },
    firstAid: { type: Boolean, default: false },
    guides: { type: Boolean, default: false }
  },
  pricing: {
    entryFee: {
      indian: { type: Number, default: 0 },
      foreign: { type: Number, default: 0 }
    },
    parkingFee: { type: Number, default: 0 },
    guideFee: {
      min: Number,
      max: Number
    }
  },
  timings: {
    openTime: String,
    closeTime: String,
    isOpen24x7: { type: Boolean, default: false },
    closedDays: [String]
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  reviews: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  stats: {
    totalVisitors: { type: Number, default: 0 },
    monthlyVisitors: { type: Number, default: 0 },
    peakSeason: String,
    averageStay: Number
  },
  sustainability: {
    ecoFriendly: { type: Boolean, default: false },
    carbonFootprint: String,
    conservationEfforts: [String],
    localCommunityBenefit: String
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Create index for location-based queries
destinationSchema.index({ 'location.coordinates': '2dsphere' });
destinationSchema.index({ category: 1, isActive: 1 });
destinationSchema.index({ 'ratings.average': -1 });

module.exports = mongoose.model('Destination', destinationSchema);