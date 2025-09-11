const express = require('express');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const User = require('../models/User');
const MarketplaceItem = require('../models/MarketplaceItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin or official
const checkAdminOrOfficial = (req, res, next) => {
  if (!['admin', 'official'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin or official role required.'
    });
  }
  next();
};

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin/Official)
router.get('/dashboard', auth, checkAdminOrOfficial, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get key statistics
    const [
      totalVisitors,
      totalRevenue,
      activeDestinations,
      localPartners,
      recentBookings,
      topDestinations,
      monthlyStats
    ] = await Promise.all([
      // Total visitors (users with tourist role)
      User.countDocuments({ role: 'tourist', createdAt: { $gte: startDate } }),
      
      // Total revenue from bookings
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate }, 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ]),
      
      // Active destinations
      Destination.countDocuments({ isActive: true }),
      
      // Local partners (guides + vendors)
      User.countDocuments({ role: { $in: ['guide', 'vendor'] }, isActive: true }),
      
      // Recent bookings
      Booking.find({ createdAt: { $gte: startDate } })
        .populate('user', 'name email')
        .populate('destination', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Top destinations by visitors
      Destination.find({ isActive: true })
        .sort({ 'stats.totalVisitors': -1 })
        .limit(5)
        .select('name stats.totalVisitors ratings.average'),
      
      // Monthly statistics
      getMonthlyStats(6) // Last 6 months
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Calculate growth percentages (mock data for demo)
    const stats = {
      totalVisitors: {
        value: totalVisitors,
        change: '+12.5%',
        trend: 'up'
      },
      totalRevenue: {
        value: revenue,
        change: '+18.3%',
        trend: 'up'
      },
      activeDestinations: {
        value: activeDestinations,
        change: '+8.7%',
        trend: 'up'
      },
      localPartners: {
        value: localPartners,
        change: '+25.4%',
        trend: 'up'
      }
    };

    res.json({
      success: true,
      data: {
        stats,
        recentBookings,
        topDestinations,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/destinations
// @desc    Get destination analytics
// @access  Private (Admin/Official)
router.get('/destinations', auth, checkAdminOrOfficial, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get destination performance data
    const destinations = await Destination.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'destination',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          recentBookings: {
            $filter: {
              input: '$bookings',
              cond: { $gte: ['$$this.createdAt', startDate] }
            }
          }
        }
      },
      {
        $addFields: {
          recentVisitors: { $size: '$recentBookings' },
          recentRevenue: {
            $sum: {
              $map: {
                input: '$recentBookings',
                as: 'booking',
                in: '$$booking.pricing.totalAmount'
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          'location.city': 1,
          'location.district': 1,
          'ratings.average': 1,
          'stats.totalVisitors': 1,
          recentVisitors: 1,
          recentRevenue: 1,
          isActive: 1,
          isFeatured: 1
        }
      },
      { $sort: { recentVisitors: -1 } }
    ]);

    // Get category-wise distribution
    const categoryStats = await Destination.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$ratings.average' },
          totalVisitors: { $sum: '$stats.totalVisitors' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        destinations,
        categoryStats,
        summary: {
          totalDestinations: destinations.length,
          averageRating: destinations.reduce((sum, dest) => sum + (dest.ratings?.average || 0), 0) / destinations.length,
          totalVisitors: destinations.reduce((sum, dest) => sum + (dest.stats?.totalVisitors || 0), 0)
        }
      }
    });

  } catch (error) {
    console.error('Destination analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/bookings
// @desc    Get booking analytics
// @access  Private (Admin/Official)
router.get('/bookings', auth, checkAdminOrOfficial, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Booking statistics
    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      revenueStats,
      bookingTrends,
      popularDestinations
    ] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: startDate } }),
      Booking.countDocuments({ createdAt: { $gte: startDate }, status: 'completed' }),
      Booking.countDocuments({ createdAt: { $gte: startDate }, status: 'cancelled' }),
      
      // Revenue statistics
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate }, 'payment.status': 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.totalAmount' },
            averageBookingValue: { $avg: '$pricing.totalAmount' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Daily booking trends
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Most booked destinations
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate }, destination: { $exists: true } } },
        {
          $group: {
            _id: '$destination',
            bookings: { $sum: 1 },
            revenue: { $sum: '$pricing.totalAmount' }
          }
        },
        {
          $lookup: {
            from: 'destinations',
            localField: '_id',
            foreignField: '_id',
            as: 'destination'
          }
        },
        { $unwind: '$destination' },
        {
          $project: {
            name: '$destination.name',
            bookings: 1,
            revenue: 1
          }
        },
        { $sort: { bookings: -1 } },
        { $limit: 10 }
      ])
    ]);

    const revenue = revenueStats.length > 0 ? revenueStats[0] : { totalRevenue: 0, averageBookingValue: 0 };

    res.json({
      success: true,
      data: {
        summary: {
          totalBookings,
          completedBookings,
          cancelledBookings,
          completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0,
          totalRevenue: revenue.totalRevenue,
          averageBookingValue: revenue.averageBookingValue
        },
        trends: bookingTrends,
        popularDestinations
      }
    });

  } catch (error) {
    console.error('Booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/users
// @desc    Get user analytics
// @access  Private (Admin/Official)
router.get('/users', auth, checkAdminOrOfficial, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // User statistics
    const [
      totalUsers,
      newUsers,
      activeUsers,
      usersByRole,
      userGrowth
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ lastLogin: { $gte: startDate } }),
      
      // Users by role
      User.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // User growth over time
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            newUsers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          newUsers,
          activeUsers,
          retentionRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0
        },
        usersByRole,
        userGrowth
      }
    });

  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get monthly statistics
async function getMonthlyStats(months) {
  const monthlyData = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
    
    const [visitors, revenue] = await Promise.all([
      User.countDocuments({ 
        role: 'tourist',
        createdAt: { $gte: startDate, $lte: endDate }
      }),
      Booking.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startDate, $lte: endDate },
            'payment.status': 'completed'
          }
        },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ])
    ]);

    monthlyData.push({
      month: startDate.toLocaleDateString('en-US', { month: 'short' }),
      visitors,
      revenue: revenue.length > 0 ? revenue[0].total / 100000 : 0 // Convert to lakhs
    });
  }
  
  return monthlyData;
}

module.exports = router;