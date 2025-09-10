import React from 'react';
import { Bot, Shield, Map, Smartphone, Users, BarChart3 } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Bot,
      title: 'AI-Powered Planning',
      description: 'Personalized itinerary planning with multilingual chatbot assistance for seamless travel experiences.',
      features: ['Smart Recommendations', 'Multi-language Support', '24/7 Assistance'],
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Secure transactions and verified guide certification using blockchain technology for trust and safety.',
      features: ['Secure Payments', 'Guide Verification', 'Digital Certificates'],
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: Map,
      title: 'Interactive Mapping',
      description: 'Real-time location services with AR/VR previews and interactive maps for immersive exploration.',
      features: ['AR/VR Previews', 'Real-time Tracking', 'Offline Maps'],
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Integration',
      description: 'Comprehensive mobile app with geo-location services and real-time transport information.',
      features: ['GPS Navigation', 'Transport Updates', 'Offline Access'],
      gradient: 'from-orange-600 to-red-600'
    },
    {
      icon: Users,
      title: 'Community Platform',
      description: 'Connect with local artisans, guides, and communities for authentic cultural experiences.',
      features: ['Local Marketplace', 'Community Reviews', 'Cultural Exchange'],
      gradient: 'from-emerald-600 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for tourism officials to monitor trends, visitor patterns, and economic impact.',
      features: ['Real-time Analytics', 'Trend Analysis', 'Economic Reports'],
      gradient: 'from-violet-600 to-purple-600'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Smart Tourism Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of tourism with our AI-powered, blockchain-secured platform 
            designed to enhance every aspect of your journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                {/* Header with Icon */}
                <div className={`bg-gradient-to-r ${service.gradient} p-8 text-white relative overflow-hidden`}>
                  <div className="relative z-10">
                    <IconComponent className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button className={`w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r ${service.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12 border border-green-100">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Ready to Transform Tourism in Jharkhand?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our platform and be part of the digital revolution that's making 
              tourism more accessible, sustainable, and inclusive for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Get Started Today
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;