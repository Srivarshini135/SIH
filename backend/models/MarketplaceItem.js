const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Textiles', 'Handicrafts', 'Homestays', 'Food Products', 'Tours', 'Jewelry', 'Art', 'Experiences']
  },
  subcategory: String,
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  pricing: {
    basePrice: { type: Number, required: true },
    discountPrice: Number,
    currency: { type: String, default: 'INR' },
    priceType: { type: String, enum: ['fixed', 'per_person', 'per_day', 'per_kg'], default: 'fixed' }
  },
  inventory: {
    available: { type: Boolean, default: true },
    quantity: { type: Number, default: 1 },
    unlimited: { type: Boolean, default: false }
  },
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      unit: { type: String, default: 'cm' }
    },
    materials: [String],
    colors: [String],
    sizes: [String],
    origin: {
      village: String,
      district: String,
      artisan: String
    }
  },
  features: {
    isEcoFriendly: { type: Boolean, default: false },
    isHandmade: { type: Boolean, default: false },
    isCertified: { type: Boolean, default: false },
    certifications: [String],
    culturalSignificance: String
  },
  shipping: {
    available: { type: Boolean, default: true },
    freeShipping: { type: Boolean, default: false },
    shippingCost: Number,
    estimatedDays: Number,
    restrictions: [String]
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
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  blockchain: {
    tokenId: String,
    contractAddress: String,
    authenticity: {
      verified: { type: Boolean, default: false },
      hash: String,
      certificate: String
    }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPromoted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Create indexes
marketplaceItemSchema.index({ category: 1, isActive: 1 });
marketplaceItemSchema.index({ seller: 1 });
marketplaceItemSchema.index({ 'ratings.average': -1 });
marketplaceItemSchema.index({ 'pricing.basePrice': 1 });
marketplaceItemSchema.index({ createdAt: -1 });

// Generate slug before saving
marketplaceItemSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);