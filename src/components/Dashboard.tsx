import React from 'react';
import { TrendingUp, Users, MapPin, DollarSign, Calendar, Award, BarChart3, Globe } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Visitors',
      value: '124,563',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Revenue Generated',
      value: '₹45.2L',
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Destinations',
      value: '52',
      change: '+8.7%',
      trend: 'up',
      icon: MapPin,
      color: 'purple'
    },
    {
      title: 'Local Partners',
      value: '1,247',
      change: '+25.4%',
      trend: 'up',
      icon: Award,
      color: 'orange'
    }
  ];

  const destinations = [
    { name: 'Netarhat', visitors: 15420, revenue: '₹8.2L', rating: 4.8 },
    { name: 'Betla National Park', visitors: 12350, revenue: '₹6.5L', rating: 4.6 },
    { name: 'Hundru Falls', visitors: 9840, revenue: '₹4.3L', rating: 4.7 },
    { name: 'Deoghar', visitors: 18500, revenue: '₹12.1L', rating: 4.9 },
    { name: 'Patratu Valley', visitors: 7650, revenue: '₹3.8L', rating: 4.5 }
  ];

  const monthlyData = [
    { month: 'Jan', visitors: 8500, revenue: 3.2 },
    { month: 'Feb', visitors: 9200, revenue: 3.8 },
    { month: 'Mar', visitors: 11800, revenue: 4.5 },
    { month: 'Apr', visitors: 13200, revenue: 5.1 },
    { month: 'May', visitors: 15600, revenue: 6.3 },
    { month: 'Jun', visitors: 14200, revenue: 5.8 }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Tourism Analytics Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            Comprehensive insights and analytics for tourism officials to monitor visitor trends, 
            economic impact, and platform performance across Jharkhand.
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Visitor Trends Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Visitor Trends</h3>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">+15.3%</span>
              </div>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="w-8 text-sm text-gray-600">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full"
                      style={{ width: `${(data.visitors / 16000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-16">{data.visitors.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Revenue Growth</h3>
              <div className="flex items-center space-x-2 text-blue-600">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">₹45.2L Total</span>
              </div>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="w-8 text-sm text-gray-600">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                      style={{ width: `${(data.revenue / 6.5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-16">₹{data.revenue}L</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Destinations Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Top Performing Destinations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Destination</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-700">Visitors</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-700">Revenue</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-700">Rating</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((destination, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{destination.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2 text-gray-700">{destination.visitors.toLocaleString()}</td>
                    <td className="text-center py-4 px-2 text-gray-700">{destination.revenue}</td>
                    <td className="text-center py-4 px-2">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-medium text-gray-700">{destination.rating}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">International Visitors</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">23.4%</p>
            <p className="text-gray-600">of total visitors are international</p>
            <div className="mt-4 text-sm text-green-600">↗️ +5.2% from last quarter</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Peak Season</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">Oct-Mar</p>
            <p className="text-gray-600">Best months for tourism</p>
            <div className="mt-4 text-sm text-blue-600">📈 Planning recommendations available</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-8 w-8 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Satisfaction Score</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-2">4.7/5</p>
            <p className="text-gray-600">Average visitor satisfaction</p>
            <div className="mt-4 text-sm text-green-600">⭐ Excellent rating maintained</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;