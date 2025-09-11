const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['destination', 'guide', 'accommodation', 'transport', 'package', 'marketplace'],
    required: true
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination'
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  accommodation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Accommodation'
  },
  transport: {
    type: mongoose.Schema.ObjectId,
    ref: 'Transport'
  },
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package'
  },
  marketplaceItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'MarketplaceItem'
  },
  details: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 }
    },
    specialRequests: String,
    preferences: {
      language: String,
      dietary: [String],
      accessibility: [String]
    }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  payment: {
    method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet', 'crypto'] },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundedAt: Date
  },
  blockchain: {
    transactionHash: String,
    contractAddress: String,
    blockNumber: Number,
    verified: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  communication: [{
    from: { type: mongoose.Schema.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    images: [String],
    submittedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    cancelledAt: Date,
    refundEligible: { type: Boolean, default: false },
    refundAmount: Number
  }
}, {
  timestamps: true
});

// Generate booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'JH' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Index for efficient queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);