const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const Destination = require('../models/Destination');
const MarketplaceItem = require('../models/MarketplaceItem');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Jharkhand tourism knowledge base
const tourismKnowledge = {
  destinations: {
    netarhat: {
      name: "Netarhat",
      description: "Queen of Chotanagpur, famous for sunrise and sunset views",
      bestTime: "October to March",
      activities: ["Sunrise viewing", "Sunset viewing", "Trekking", "Photography"],
      accommodation: ["Hotels", "Guest houses", "Forest rest houses"],
      howToReach: "By road from Ranchi (156 km), nearest railway station is Lohardaga"
    },
    betla: {
      name: "Betla National Park",
      description: "Wildlife sanctuary with tigers, elephants, and diverse flora",
      bestTime: "October to April",
      activities: ["Wildlife safari", "Bird watching", "Nature walks"],
      accommodation: ["Forest lodges", "Tourist complexes"],
      howToReach: "By road from Ranchi (170 km), nearest railway station is Daltonganj"
    },
    hundru: {
      name: "Hundru Falls",
      description: "Spectacular waterfall with 98-meter drop",
      bestTime: "July to February",
      activities: ["Waterfall viewing", "Photography", "Trekking"],
      accommodation: ["Hotels in Ranchi", "Day trip destination"],
      howToReach: "45 km from Ranchi by road"
    },
    deoghar: {
      name: "Deoghar",
      description: "Sacred city with ancient Baidyanath Temple",
      bestTime: "October to March",
      activities: ["Temple visits", "Spiritual tours", "Cultural experiences"],
      accommodation: ["Hotels", "Dharamshalas", "Guest houses"],
      howToReach: "Well connected by rail and road, Deoghar railway station"
    }
  },
  culture: {
    tribes: ["Santhal", "Munda", "Oraon", "Ho", "Kharia"],
    festivals: ["Sarhul", "Karma", "Sohrai", "Tusu"],
    crafts: ["Dokra metal craft", "Tribal paintings", "Handwoven textiles", "Bamboo crafts"],
    cuisine: ["Dhuska", "Rugra", "Handia", "Tribal vegetables"]
  },
  weather: {
    summer: "Hot (April-June), 25-40°C",
    monsoon: "Rainy (July-September), 20-30°C",
    winter: "Pleasant (October-March), 10-25°C"
  }
};

// @route   POST /api/chatbot/chat
// @desc    Process chatbot message
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Check if it's a simple query that can be answered from knowledge base
    const simpleResponse = await getSimpleResponse(message.toLowerCase());
    if (simpleResponse) {
      return res.json({
        success: true,
        response: simpleResponse,
        type: 'simple'
      });
    }

    // For complex queries, use OpenAI
    if (process.env.OPENAI_API_KEY) {
      const aiResponse = await getAIResponse(message);
      return res.json({
        success: true,
        response: aiResponse,
        type: 'ai'
      });
    }

    // Fallback response
    const fallbackResponse = getFallbackResponse(message.toLowerCase());
    res.json({
      success: true,
      response: fallbackResponse,
      type: 'fallback'
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      response: 'I apologize, but I\'m having technical difficulties right now. Please try asking your question again, or contact our support team for immediate assistance.'
    });
  }
});

// @route   GET /api/chatbot/suggestions
// @desc    Get chat suggestions based on context
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { context } = req.query;

    let suggestions = [];

    switch (context) {
      case 'destinations':
        suggestions = [
          "Tell me about Netarhat",
          "Best time to visit Betla National Park",
          "How to reach Hundru Falls",
          "What to do in Deoghar"
        ];
        break;
      case 'planning':
        suggestions = [
          "Plan a 3-day itinerary",
          "Best places for adventure activities",
          "Family-friendly destinations",
          "Budget travel options"
        ];
        break;
      case 'culture':
        suggestions = [
          "Tell me about tribal culture",
          "Local festivals in Jharkhand",
          "Traditional handicrafts",
          "Local cuisine recommendations"
        ];
        break;
      default:
        suggestions = [
          "Show me popular destinations",
          "Plan my trip to Jharkhand",
          "Tell me about local culture",
          "What's the weather like?"
        ];
    }

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get simple responses from knowledge base
async function getSimpleResponse(message) {
  // Destination queries
  if (message.includes('netarhat')) {
    const dest = tourismKnowledge.destinations.netarhat;
    return `🏔️ **${dest.name}** - ${dest.description}\n\n**Best Time:** ${dest.bestTime}\n**Activities:** ${dest.activities.join(', ')}\n**How to Reach:** ${dest.howToReach}\n\nWould you like more details about accommodation or specific activities?`;
  }

  if (message.includes('betla')) {
    const dest = tourismKnowledge.destinations.betla;
    return `🐅 **${dest.name}** - ${dest.description}\n\n**Best Time:** ${dest.bestTime}\n**Activities:** ${dest.activities.join(', ')}\n**How to Reach:** ${dest.howToReach}\n\nShall I help you plan a wildlife safari?`;
  }

  if (message.includes('hundru')) {
    const dest = tourismKnowledge.destinations.hundru;
    return `💧 **${dest.name}** - ${dest.description}\n\n**Best Time:** ${dest.bestTime}\n**Activities:** ${dest.activities.join(', ')}\n**How to Reach:** ${dest.howToReach}\n\nPerfect for a day trip from Ranchi!`;
  }

  if (message.includes('deoghar')) {
    const dest = tourismKnowledge.destinations.deoghar;
    return `🛕 **${dest.name}** - ${dest.description}\n\n**Best Time:** ${dest.bestTime}\n**Activities:** ${dest.activities.join(', ')}\n**How to Reach:** ${dest.howToReach}\n\nWould you like information about temple timings?`;
  }

  // Weather queries
  if (message.includes('weather') || message.includes('climate')) {
    return `🌤️ **Jharkhand Weather:**\n\n**Summer (Apr-Jun):** ${tourismKnowledge.weather.summer}\n**Monsoon (Jul-Sep):** ${tourismKnowledge.weather.monsoon}\n**Winter (Oct-Mar):** ${tourismKnowledge.weather.winter}\n\n**Best time to visit:** October to March for pleasant weather!`;
  }

  // Culture queries
  if (message.includes('culture') || message.includes('tribal')) {
    return `🎭 **Rich Tribal Culture:**\n\n**Major Tribes:** ${tourismKnowledge.culture.tribes.join(', ')}\n**Festivals:** ${tourismKnowledge.culture.festivals.join(', ')}\n**Handicrafts:** ${tourismKnowledge.culture.crafts.join(', ')}\n**Cuisine:** ${tourismKnowledge.culture.cuisine.join(', ')}\n\nInterested in cultural tours or handicraft shopping?`;
  }

  // Food queries
  if (message.includes('food') || message.includes('cuisine')) {
    return `🍛 **Must-try Jharkhand Cuisine:**\n\n🥞 **Dhuska** - Rice pancakes\n🍄 **Rugra** - Mushroom curry\n🍯 **Forest honey** - Pure and organic\n🍖 **Handia** - Traditional rice beer\n🌿 **Tribal vegetables** - Unique forest produce\n\nWant restaurant recommendations for these dishes?`;
  }

  return null;
}

// Helper function to get AI response using OpenAI
async function getAIResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for Jharkhand Tourism. You have extensive knowledge about Jharkhand's destinations, culture, food, weather, and travel information. 

Key destinations include:
- Netarhat (Hill station, sunrise/sunset views)
- Betla National Park (Wildlife, tigers, elephants)
- Hundru Falls (98m waterfall, near Ranchi)
- Deoghar (Religious, Baidyanath Temple)
- Patratu Valley (Scenic lake and valley)
- Ranchi (Capital city)

Provide helpful, accurate, and engaging responses about Jharkhand tourism. Use emojis appropriately and format responses nicely. Always be encouraging about visiting Jharkhand and offer to help with specific planning.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Helper function for fallback responses
function getFallbackResponse(message) {
  if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
    return "Namaste! 🙏 Welcome to Jharkhand Tourism! I'm here to help you discover the beautiful destinations, rich culture, and amazing experiences that Jharkhand has to offer. What would you like to know about?";
  }

  if (message.includes('plan') || message.includes('itinerary')) {
    return "I'd love to help you plan your Jharkhand adventure! 🗺️\n\nTo create the perfect itinerary, could you tell me:\n📅 How many days do you have?\n👥 How many people in your group?\n🎯 What interests you most? (Nature, Culture, Adventure, Spiritual)\n💰 What's your budget range?\n\nShare these details and I'll suggest the best destinations and activities!";
  }

  if (message.includes('book') || message.includes('reservation')) {
    return "Great! I can help you with bookings! 🎫\n\nI can assist with:\n🏨 Hotels & Homestays\n🚗 Transportation\n👨‍🎓 Certified Local Guides\n🎪 Activity Packages\n🛍️ Marketplace Items\n\nWhat would you like to book first? I'll connect you with our booking system!";
  }

  if (message.includes('guide') || message.includes('local')) {
    return "Our certified local guides are amazing! 👨‍🎓\n\n✅ Multi-language support\n✅ Local insights & hidden gems\n✅ Verified & trusted\n✅ Fair pricing (₹1,000-2,500/day)\n\nThey can show you places that aren't in any guidebook! Which destinations are you interested in exploring with a guide?";
  }

  return "I understand you're interested in exploring Jharkhand! 🏔️ I can help you with:\n\n🗺️ **Destinations** - Popular places to visit\n📅 **Trip Planning** - Customized itineraries\n🎭 **Culture** - Tribal heritage & festivals\n🍛 **Food** - Local cuisine recommendations\n🏨 **Bookings** - Hotels, guides, activities\n🌤️ **Weather** - Best time to visit\n\nWhat would you like to know more about?";
}

module.exports = router;