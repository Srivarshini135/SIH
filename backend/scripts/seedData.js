const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Destination = require('../models/Destination');
const MarketplaceItem = require('../models/MarketplaceItem');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jharkhand_tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@jharhandtourism.com',
    password: 'admin123',
    role: 'admin',
    verification: { isEmailVerified: true }
  },
  {
    name: 'Tourism Official',
    email: 'official@jharhandtourism.com',
    password: 'official123',
    role: 'official',
    verification: { isEmailVerified: true }
  },
  {
    name: 'Ramesh Kumar',
    email: 'ramesh.guide@gmail.com',
    password: 'guide123',
    role: 'guide',
    phone: '9876543210',
    profile: {
      bio: 'Experienced local guide with 10+ years in Jharkhand tourism',
      location: { city: 'Ranchi', state: 'Jharkhand' }
    },
    verification: { isEmailVerified: true, isGuideVerified: true }
  },
  {
    name: 'Sita Devi',
    email: 'sita.artisan@gmail.com',
    password: 'vendor123',
    role: 'vendor',
    phone: '9876543211',
    profile: {
      bio: 'Traditional Dokra metal craft artisan from Khunti',
      location: { city: 'Khunti', state: 'Jharkhand' }
    },
    verification: { isEmailVerified: true }
  }
];

const sampleDestinations = [
  {
    name: 'Netarhat',
    description: 'Known as the Queen of Chotanagpur, Netarhat is famous for its sunrise and sunset views, pleasant climate, and scenic beauty.',
    category: 'Hill Station',
    location: {
      address: 'Netarhat, Latehar District',
      city: 'Netarhat',
      district: 'Latehar',
      coordinates: { latitude: 23.4667, longitude: 84.2667 },
      nearbyPlaces: ['Magnolia Point', 'Sunrise Point', 'Sunset Point']
    },
    images: [{
      url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
      caption: 'Netarhat Hill Station',
      isPrimary: true
    }],
    highlights: ['Sunrise Point', 'Sunset Point', 'Magnolia Point', 'Pleasant Climate'],
    activities: [
      { name: 'Sunrise Viewing', description: 'Watch spectacular sunrise from Sunrise Point', duration: '1 hour', price: 0, difficulty: 'Easy' },
      { name: 'Sunset Viewing', description: 'Enjoy beautiful sunset views', duration: '1 hour', price: 0, difficulty: 'Easy' },
      { name: 'Nature Walk', description: 'Explore the natural beauty', duration: '2-3 hours', price: 0, difficulty: 'Easy' }
    ],
    bestTimeToVisit: {
      months: ['October', 'November', 'December', 'January', 'February', 'March'],
      weather: 'Pleasant and cool',
      temperature: { min: 10, max: 25 }
    },
    pricing: {
      entryFee: { indian: 0, foreign: 0 },
      parkingFee: 20,
      guideFee: { min: 1000, max: 2000 }
    },
    ratings: { average: 4.8, count: 156 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Betla National Park',
    description: 'One of the first national parks in India, known for its tigers, elephants, and diverse wildlife.',
    category: 'Wildlife',
    location: {
      address: 'Betla National Park, Latehar District',
      city: 'Betla',
      district: 'Latehar',
      coordinates: { latitude: 23.9167, longitude: 84.1833 },
      nearbyPlaces: ['Palamau Fort', 'Kechki', 'Netarhat']
    },
    images: [{
      url: 'https://images.pexels.com/photos/1661546/pexels-photo-1661546.jpeg',
      caption: 'Wildlife at Betla National Park',
      isPrimary: true
    }],
    highlights: ['Tiger Safari', 'Elephant Sighting', 'Bird Watching', 'Palamau Fort'],
    activities: [
      { name: 'Wildlife Safari', description: 'Jeep safari to spot tigers and other wildlife', duration: '3-4 hours', price: 2500, difficulty: 'Easy' },
      { name: 'Bird Watching', description: 'Spot various bird species', duration: '2-3 hours', price: 500, difficulty: 'Easy' },
      { name: 'Fort Visit', description: 'Visit historic Palamau Fort', duration: '2 hours', price: 100, difficulty: 'Easy' }
    ],
    bestTimeToVisit: {
      months: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
      weather: 'Dry and pleasant',
      temperature: { min: 15, max: 30 }
    },
    pricing: {
      entryFee: { indian: 150, foreign: 600 },
      parkingFee: 50,
      guideFee: { min: 1500, max: 2500 }
    },
    ratings: { average: 4.6, count: 203 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Hundru Falls',
    description: 'A spectacular waterfall with a 98-meter drop, located near Ranchi. Perfect for adventure enthusiasts.',
    category: 'Adventure',
    location: {
      address: 'Hundru Falls, Ranchi District',
      city: 'Ranchi',
      district: 'Ranchi',
      coordinates: { latitude: 23.4239, longitude: 85.5906 },
      nearbyPlaces: ['Jonha Falls', 'Dassam Falls', 'Ranchi']
    },
    images: [{
      url: 'https://images.pexels.com/photos/1062280/pexels-photo-1062280.jpeg',
      caption: 'Hundru Falls',
      isPrimary: true
    }],
    highlights: ['98m Waterfall', 'Rock Climbing', 'Photography', 'Natural Pool'],
    activities: [
      { name: 'Waterfall Viewing', description: 'Enjoy the spectacular 98m waterfall', duration: '1-2 hours', price: 0, difficulty: 'Easy' },
      { name: 'Rock Climbing', description: 'Adventure rock climbing activity', duration: '2-3 hours', price: 1500, difficulty: 'Hard' },
      { name: 'Photography', description: 'Capture beautiful moments', duration: '1-2 hours', price: 0, difficulty: 'Easy' }
    ],
    bestTimeToVisit: {
      months: ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February'],
      weather: 'Best during and after monsoon',
      temperature: { min: 18, max: 32 }
    },
    pricing: {
      entryFee: { indian: 30, foreign: 100 },
      parkingFee: 30,
      guideFee: { min: 800, max: 1500 }
    },
    ratings: { average: 4.7, count: 189 },
    isActive: true,
    isFeatured: true
  }
];

const sampleMarketplaceItems = [
  {
    name: 'Tribal Handwoven Saree',
    description: 'Beautiful handwoven saree made by Santhali tribal women using traditional techniques passed down through generations.',
    category: 'Textiles',
    pricing: { basePrice: 2500, discountPrice: 2000 },
    images: [{
      url: 'https://images.pexels.com/photos/5480696/pexels-photo-5480696.jpeg',
      caption: 'Traditional Tribal Saree',
      isPrimary: true
    }],
    specifications: {
      materials: ['Cotton', 'Natural Dyes'],
      colors: ['Red', 'Yellow', 'Green'],
      origin: { village: 'Dumka', district: 'Dumka', artisan: 'Santhali Weavers Cooperative' }
    },
    features: {
      isEcoFriendly: true,
      isHandmade: true,
      isCertified: true,
      culturalSignificance: 'Traditional Santhali tribal design representing nature and harmony'
    },
    ratings: { average: 4.8, count: 124 },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Dokra Metal Craft Elephant',
    description: 'Exquisite Dokra metal craft elephant made using the ancient lost-wax casting technique by tribal artisans.',
    category: 'Handicrafts',
    pricing: { basePrice: 1800, discountPrice: 1500 },
    images: [{
      url: 'https://images.pexels.com/photos/6195049/pexels-photo-6195049.jpeg',
      caption: 'Dokra Metal Elephant',
      isPrimary: true
    }],
    specifications: {
      dimensions: { length: 15, width: 8, height: 12, weight: 500, unit: 'cm' },
      materials: ['Bronze', 'Brass'],
      origin: { village: 'Khunti', district: 'Khunti', artisan: 'Dhokra Art Center' }
    },
    features: {
      isEcoFriendly: true,
      isHandmade: true,
      isCertified: true,
      culturalSignificance: 'Ancient Dokra art form dating back 4000 years'
    },
    ratings: { average: 4.9, count: 87 },
    isActive: true,
    isFeatured: true
  }
];

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await MarketplaceItem.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
      users.push(userData);
    }
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create destinations
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const destinationsWithCreator = sampleDestinations.map(dest => ({
      ...dest,
      createdBy: adminUser._id
    }));
    const createdDestinations = await Destination.insertMany(destinationsWithCreator);
    console.log(`✅ Created ${createdDestinations.length} destinations`);

    // Create marketplace items
    const vendorUser = createdUsers.find(user => user.role === 'vendor');
    const marketplaceItemsWithSeller = sampleMarketplaceItems.map(item => ({
      ...item,
      seller: vendorUser._id
    }));
    const createdMarketplaceItems = await MarketplaceItem.insertMany(marketplaceItemsWithSeller);
    console.log(`✅ Created ${createdMarketplaceItems.length} marketplace items`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@jharhandtourism.com / admin123');
    console.log('Official: official@jharhandtourism.com / official123');
    console.log('Guide: ramesh.guide@gmail.com / guide123');
    console.log('Vendor: sita.artisan@gmail.com / vendor123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();