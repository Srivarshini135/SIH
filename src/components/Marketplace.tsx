import React from 'react';
import { ShoppingCart, Star, Heart, Filter, Search } from 'lucide-react';

const Marketplace: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Tribal Handwoven Saree',
      price: 2500,
      originalPrice: 3200,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/5480696/pexels-photo-5480696.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'Santhali Weavers Cooperative',
      category: 'Textiles',
      location: 'Dumka',
      isEcoFriendly: true
    },
    {
      id: 2,
      name: 'Dokra Metal Craft Elephant',
      price: 1800,
      originalPrice: 2200,
      rating: 4.9,
      reviews: 87,
      image: 'https://images.pexels.com/photos/6195049/pexels-photo-6195049.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'Dhokra Art Center',
      category: 'Handicrafts',
      location: 'Khunti',
      isEcoFriendly: true
    },
    {
      id: 3,
      name: 'Tribal Homestay Experience',
      price: 1200,
      originalPrice: 1500,
      rating: 4.7,
      reviews: 45,
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'Munda Heritage Homes',
      category: 'Homestays',
      location: 'Ranchi',
      isEcoFriendly: true,
      duration: '2 days / 1 night'
    },
    {
      id: 4,
      name: 'Organic Honey & Forest Products',
      price: 450,
      originalPrice: 600,
      rating: 4.6,
      reviews: 203,
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'Forest Cooperative Society',
      category: 'Food Products',
      location: 'Gumla',
      isEcoFriendly: true
    },
    {
      id: 5,
      name: 'Eco-Tourism Safari Package',
      price: 3500,
      originalPrice: 4200,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.pexels.com/photos/1661546/pexels-photo-1661546.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'Betla Adventure Tours',
      category: 'Tours',
      location: 'Betla National Park',
      isEcoFriendly: true,
      duration: '3 days / 2 nights'
    },
    {
      id: 6,
      name: 'Traditional Tribal Jewelry Set',
      price: 2200,
      originalPrice: 2800,
      rating: 4.5,
      reviews: 92,
      image: 'https://images.pexels.com/photos/1454441/pexels-photo-1454441.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'Oraon Craft Guild',
      category: 'Jewelry',
      location: 'Garhwa',
      isEcoFriendly: true
    }
  ];

  const categories = ['All', 'Textiles', 'Handicrafts', 'Homestays', 'Food Products', 'Tours', 'Jewelry'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Local Marketplace
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Support local artisans and communities while discovering authentic tribal handicrafts, 
            eco-tourism packages, and traditional products from Jharkhand.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products, sellers, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.isEcoFriendly && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <span>🌱</span>
                    <span>Eco-Friendly</span>
                  </div>
                )}
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
                {product.originalPrice > product.price && (
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-green-600 font-medium">{product.category}</span>
                  {product.duration && (
                    <span className="text-sm text-gray-500 ml-2">• {product.duration}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                
                <p className="text-gray-600 text-sm mb-3">by {product.seller}</p>
                <p className="text-gray-500 text-sm mb-4">📍 {product.location}</p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-all duration-300">
                    <Eye className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-green-100">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Join Our Marketplace Community
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Are you a local artisan, guide, or service provider? Join our platform 
              and reach thousands of tourists while preserving Jharkhand's rich heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Become a Seller
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Eye: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default Marketplace;