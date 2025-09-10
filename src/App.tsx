import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Services from './components/Services';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'explore' && (
        <>
          <Hero />
          <Destinations />
          <Services />
        </>
      )}
      
      {activeTab === 'marketplace' && <Marketplace />}
      {activeTab === 'dashboard' && <Dashboard />}
      
      <Footer />
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
        </svg>
      </button>
    </div>
  );
}

export default App;