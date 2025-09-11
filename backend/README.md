# Jharkhand Tourism Platform - Backend API

A comprehensive backend API for the Smart Digital Tourism Platform for Jharkhand, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **AI-Powered Chatbot**: Intelligent tourism assistance with OpenAI integration
- **Blockchain Integration**: Secure transactions and guide verification
- **Real-time Services**: Socket.io for live updates and notifications
- **Analytics Dashboard**: Comprehensive tourism analytics for officials
- **Marketplace API**: Local artisan and service provider marketplace
- **Destination Management**: Complete CRUD operations for tourist destinations
- **Booking System**: End-to-end booking management with payment integration
- **Multi-language Support**: Internationalization ready
- **File Upload**: Cloudinary integration for image management
- **Security**: Helmet, rate limiting, and input validation

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **AI Integration**: OpenAI GPT
- **Blockchain**: Web3.js for Ethereum integration
- **Payment**: Stripe integration
- **File Storage**: Cloudinary
- **Validation**: Joi & Express-validator
- **Security**: Helmet, bcryptjs, rate limiting
- **Email**: Nodemailer
- **Caching**: Redis (optional)

## 📁 Project Structure

```
backend/
├── models/              # Database models
│   ├── User.js         # User model with roles
│   ├── Destination.js  # Tourist destinations
│   ├── Booking.js      # Booking management
│   └── MarketplaceItem.js # Marketplace products
├── routes/             # API routes
│   ├── auth.js        # Authentication routes
│   ├── destinations.js # Destination CRUD
│   ├── bookings.js    # Booking management
│   ├── marketplace.js # Marketplace API
│   ├── chatbot.js     # AI chatbot endpoints
│   ├── analytics.js   # Analytics dashboard
│   ├── blockchain.js  # Blockchain integration
│   └── realtime.js    # Real-time features
├── middleware/         # Custom middleware
│   ├── auth.js        # JWT authentication
│   └── errorHandler.js # Global error handling
├── scripts/           # Utility scripts
│   └── seedData.js    # Database seeding
├── server.js          # Main server file
├── package.json       # Dependencies
└── README.md         # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/jharkhand_tourism
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Server
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # OpenAI (for AI chatbot)
   OPENAI_API_KEY=your_openai_api_key
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Stripe (for payments)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
POST /api/auth/logout      # Logout user
```

### Destination Endpoints

```
GET    /api/destinations           # Get all destinations (with filters)
GET    /api/destinations/:id       # Get single destination
POST   /api/destinations           # Create destination (Admin/Official)
PUT    /api/destinations/:id       # Update destination (Admin/Official)
POST   /api/destinations/:id/reviews # Add review
GET    /api/destinations/nearby/:lat/:lng # Get nearby destinations
```

### Booking Endpoints

```
GET    /api/bookings              # Get user bookings
POST   /api/bookings              # Create new booking
GET    /api/bookings/:id          # Get booking details
PUT    /api/bookings/:id          # Update booking
DELETE /api/bookings/:id          # Cancel booking
```

### Marketplace Endpoints

```
GET    /api/marketplace           # Get marketplace items
GET    /api/marketplace/:id       # Get single item
POST   /api/marketplace           # Create item (Vendor)
PUT    /api/marketplace/:id       # Update item (Vendor)
POST   /api/marketplace/:id/reviews # Add review
```

### Chatbot Endpoints

```
POST /api/chatbot/chat           # Send message to chatbot
GET  /api/chatbot/suggestions    # Get chat suggestions
```

### Analytics Endpoints (Admin/Official only)

```
GET /api/analytics/dashboard     # Dashboard overview
GET /api/analytics/destinations  # Destination analytics
GET /api/analytics/bookings     # Booking analytics
GET /api/analytics/users        # User analytics
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **tourist**: Regular users who book destinations
- **guide**: Certified local guides
- **vendor**: Marketplace sellers (artisans, service providers)
- **official**: Tourism department officials
- **admin**: System administrators

## 🤖 AI Chatbot Integration

The chatbot provides intelligent assistance using:

1. **Knowledge Base**: Pre-defined responses for common queries
2. **OpenAI Integration**: Advanced AI responses for complex queries
3. **Context Awareness**: Maintains conversation context
4. **Multi-language Support**: Supports multiple Indian languages

### Sample Chatbot Queries

- "Tell me about Netarhat"
- "Plan a 3-day itinerary for Jharkhand"
- "What's the weather like in Jharkhand?"
- "Show me tribal handicrafts"
- "Book a guide for Betla National Park"

## 🔗 Blockchain Integration

Features include:

- **Guide Verification**: Blockchain-based certification
- **Secure Transactions**: Cryptocurrency payment support
- **Digital Certificates**: Immutable certification records
- **Smart Contracts**: Automated booking and payment processing

## 📊 Analytics Dashboard

Comprehensive analytics for tourism officials:

- **Visitor Statistics**: Real-time visitor tracking
- **Revenue Analytics**: Booking and marketplace revenue
- **Destination Performance**: Popular destinations and ratings
- **User Engagement**: User activity and retention metrics
- **Seasonal Trends**: Tourism patterns and forecasting

## 🛡 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **SQL Injection Protection**: MongoDB injection prevention

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   # ... other production configs
   ```

2. **Build and Start**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized MongoDB indexes
- **Caching**: Redis caching for frequently accessed data
- **Compression**: Gzip compression for responses
- **Connection Pooling**: MongoDB connection optimization
- **Rate Limiting**: API request throttling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@jharhandtourism.com
- Documentation: [API Docs](https://api.jharhandtourism.com/docs)
- Issues: [GitHub Issues](https://github.com/jharkhand-tourism/backend/issues)

---

**Built with ❤️ for Jharkhand Tourism**