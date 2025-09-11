const express = require('express');
const Destination = require('../models/Destination');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/destinations
// @desc    Get all destinations with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      city,
      district,
      minRating,
      maxPrice,
      sortBy,
      page = 1,
      limit = 12,
      search,
      featured
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (district) {
      query['location.district'] = new RegExp(district, 'i');
    }

    if (minRating) {
      query['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      query['pricing.entryFee.indian'] = { $lte: parseInt(maxPrice) };
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { highlights: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { 'ratings.average': -1 };
        break;
      case 'price_low':
        sort = { 'pricing.entryFee.indian': 1 };
        break;
      case 'price_high':
        sort = { 'pricing.entryFee.indian': -1 };
        break;
      case 'popular':
        sort = { 'stats.totalVisitors': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query with pagination
    const destinations = await Destination.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name')
      .select('-reviews'); // Exclude reviews for list view

    const total = await Destination.countDocuments(query);

    res.json({
      success: true,
      count: destinations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: destinations
    });

  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/destinations/:id
// @desc    Get single destination
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('reviews.user', 'name profile.avatar');

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Increment view count
    destination.stats.totalVisitors += 1;
    await destination.save();

    res.json({
      success: true,
      data: destination
    });

  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/destinations
// @desc    Create new destination
// @access  Private (Admin/Official)
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['Hill Station', 'Wildlife', 'Adventure', 'Religious', 'Nature', 'City', 'Cultural', 'Historical']).withMessage('Invalid category'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], async (req, res) => {
  try {
    // Check if user is admin or official
    if (!['admin', 'official'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create destinations'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const destination = new Destination({
      ...req.body,
      createdBy: req.user.id
    });

    await destination.save();

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination
    });

  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/destinations/:id
// @desc    Update destination
// @access  Private (Admin/Official)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or official
    if (!['admin', 'official'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update destinations'
      });
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });

  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/destinations/:id/reviews
// @desc    Add review to destination
// @access  Private
router.post('/:id/reviews', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Check if user already reviewed
    const existingReview = destination.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this destination'
      });
    }

    const { rating, comment, images } = req.body;

    // Add review
    destination.reviews.push({
      user: req.user.id,
      rating,
      comment,
      images: images || []
    });

    // Update ratings
    const totalRatings = destination.reviews.length;
    const sumRatings = destination.reviews.reduce((sum, review) => sum + review.rating, 0);
    destination.ratings.average = sumRatings / totalRatings;
    destination.ratings.count = totalRatings;
    destination.ratings.breakdown[rating] += 1;

    await destination.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/destinations/nearby/:lat/:lng
// @desc    Get nearby destinations
// @access  Public
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const radius = req.query.radius || 50; // km

    const destinations = await Destination.find({
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert to meters
        }
      }
    }).limit(10);

    res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });

  } catch (error) {
    console.error('Get nearby destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;