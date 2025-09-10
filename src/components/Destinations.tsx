import React from 'react';
import { Star, MapPin, Camera, Clock } from 'lucide-react';

const Destinations: React.FC = () => {
  const destinations = [
    {
      id: 1,
      name: 'Netarhat',
      description: 'Queen of Chotanagpur, famous for sunrise and sunset views',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      duration: '2-3 days',
      highlights: ['Sunrise Point', 'Sunset Point', 'Magnolia Point'],
      category: 'Hill Station'
    },
    {
      id: 2,
      name: 'Betla National Park',
      description: 'Wildlife sanctuary with tigers, elephants, and diverse flora',
      image: 'https://images.pexels.com/photos/1661546/pexels-photo-1661546.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      duration: '1-2 days',
      highlights: ['Wildlife Safari', 'Palamau Fort', 'Nature Trails'],
      category: 'Wildlife'
    },
    {
      id: 3,
      name: 'Hundru Falls',
      description: 'Spectacular waterfall with 98-meter drop, perfect for adventure lovers',
      image: 'https://images.pexels.com/photos/1062280/pexels-photo-1062280.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      duration: '1 day',
      highlights: ['Waterfall Trek', 'Rock Climbing', 'Photography'],
      category: 'Adventure'
    },
    {
      id: 4,
      name: 'Deoghar',
      description: 'Sacred city with ancient Baidyanath Temple, spiritual center',
      image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      duration: '2-3 days',
      highlights: ['Baidyanath Temple', 'Nandan Pahar', 'Spiritual Tours'],
      category: 'Religious'
    },
    {
      id: 5,
      name: 'Patratu Valley',
      description: 'Scenic valley with pristine lake and lush green surroundings',
      image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      duration: '1-2 days',
      highlights: ['Patratu Dam', 'Boating', 'Scenic Views'],
      category: 'Nature'
    },
    {
      id: 6,
      name: 'Ranchi',
      description: 'Capital city with modern amenities and cultural attractions',
      image: 'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.4,
      duration: '2-3 days',
      highlights: ['Rock Garden', 'Tagore Hill', 'Tribal Museums'],
      category: 'City'
    }
  ];

  const categories = ['All', 'Hill Station', 'Wildlife', 'Adventure', 'Religious', 'Nature', 'City'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredDestinations = selectedCategory === 'All' 
    ? destinations 
    : destinations.filter(dest => dest.category === selectedCategory);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Explore Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover Jharkhand's most breathtaking destinations, each offering unique experiences 
            from pristine nature to rich cultural heritage.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {destination.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Camera className="h-5 w-5 text-gray-700" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{destination.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-700">{destination.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{destination.description}</p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Jharkhand</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                    Explore Now
                  </button>
                  <button className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-all duration-300">
                    <Star className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;