import React, { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, Maximize2, Bot, User } from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Namaste! I'm your AI tourism assistant for Jharkhand. How can I help you plan your perfect trip? 🏔️",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses: { [key: string]: string } = {
    'hello': "Hello! Welcome to Jharkhand Tourism. I can help you with destinations, bookings, local guides, and travel tips. What interests you most?",
    'destinations': "Jharkhand has amazing destinations! Popular ones include:\n\n🏔️ Netarhat - Queen of Chotanagpur\n🐅 Betla National Park - Wildlife safari\n💧 Hundru Falls - 98m waterfall\n🛕 Deoghar - Sacred Baidyanath Temple\n🏞️ Patratu Valley - Scenic beauty\n\nWhich type interests you most?",
    'netarhat': "Netarhat is perfect for nature lovers! Best time: October-March. Activities include sunrise/sunset viewing, trekking, and photography. I can help you book accommodations and local guides. Interested?",
    'betla': "Betla National Park offers incredible wildlife experiences! Tiger safaris, elephant sightings, and bird watching. Best visited October-April. Would you like help planning a safari package?",
    'booking': "I can help you book:\n\n🏨 Hotels & Homestays\n🚗 Transportation\n👨‍🎓 Certified Local Guides\n🎫 Activity Packages\n\nWhat would you like to book first?",
    'weather': "Jharkhand has pleasant weather! Best visiting months:\n\n🌤️ Oct-Mar: Cool & pleasant (15-25°C)\n☀️ Apr-Jun: Hot but manageable\n🌧️ Jul-Sep: Monsoon season\n\nWhen are you planning to visit?",
    'culture': "Jharkhand's tribal culture is fascinating! Experience:\n\n🎭 Tribal dance & music\n🛍️ Handwoven textiles & crafts\n🏠 Traditional homestays\n🍛 Authentic tribal cuisine\n\nInterested in cultural tours?",
    'food': "Must-try Jharkhand cuisine:\n\n🍛 Dhuska - Rice pancakes\n🥘 Rugra - Mushroom curry\n🌿 Tribal herbs & vegetables\n🍯 Forest honey\n🍖 Handia - Traditional rice beer\n\nWant restaurant recommendations?"
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Default responses for common patterns
    if (message.includes('plan') || message.includes('itinerary')) {
      return "I'd love to help plan your Jharkhand itinerary! To create the perfect trip:\n\n📅 How many days do you have?\n👥 How many people?\n🎯 Interests (nature, culture, adventure, spiritual)?\n💰 Budget range?\n\nShare these details and I'll create a customized plan!";
    }

    if (message.includes('price') || message.includes('cost')) {
      return "Jharkhand offers great value! Rough estimates:\n\n🏨 Budget hotels: ₹800-1,500/night\n🏠 Homestays: ₹1,200-2,500/night\n🚗 Car rental: ₹2,000-4,000/day\n🎫 Entry fees: ₹20-200/person\n\nWant detailed pricing for specific destinations?";
    }

    if (message.includes('guide') || message.includes('local')) {
      return "Our certified local guides are amazing! They offer:\n\n🗣️ Multi-language support\n📍 Local insights & hidden gems\n🛡️ Verified & trusted\n💰 Fair pricing\n\nRates: ₹1,000-2,500/day depending on location. Shall I connect you with guides for your preferred destinations?";
    }

    return "I understand you're interested in exploring Jharkhand! I can help with destinations, bookings, cultural experiences, food recommendations, and travel planning. Could you be more specific about what you'd like to know? 😊";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Show me popular destinations",
    "Plan 3-day itinerary", 
    "Book local guide",
    "Weather information",
    "Cultural experiences"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Jharkhand AI Assistant</h3>
            <p className="text-sm text-green-100">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <p className="whitespace-pre-line text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputText(action)}
                className="text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 py-1 rounded-full hover:from-green-200 hover:to-blue-200 transition-all duration-200"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about destinations, bookings, guides..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent max-h-20"
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;