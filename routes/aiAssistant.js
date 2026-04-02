const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// AI Assistant chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // For now, we'll simulate AI responses
    // In a real implementation, you would integrate with OpenAI, Google AI, or similar
    const responses = {
      greeting: [
        "Hello! I'm your AI career assistant. How can I help you today?",
        "Hi there! Ready to advance your career? What would you like to know?",
        "Welcome! I'm here to guide you through your learning journey. What's on your mind?"
      ],
      course: [
        "That's a great course choice! It will help you build essential skills in your domain.",
        "This course covers important concepts that are highly valued by employers.",
        "I recommend taking notes while studying this course for better retention."
      ],
      career: [
        "Based on current market trends, this skill is in high demand.",
        "Consider building a portfolio project to showcase these skills to employers.",
        "Don't forget to update your LinkedIn profile with your new skills!"
      ],
      quiz: [
        "Great job on completing the quiz! Practice makes perfect.",
        "If you didn't pass, don't worry - review the material and try again.",
        "Quiz results help identify areas where you need more practice."
      ],
      default: [
        "I'm here to help with your career development. Feel free to ask about courses, skills, or career advice!",
        "You can ask me about course recommendations, study tips, or career guidance.",
        "I can help you with learning strategies, skill development, and career planning."
      ]
    };

    // Simple keyword-based response selection
    let responseType = 'default';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      responseType = 'greeting';
    } else if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
      responseType = 'course';
    } else if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('skill')) {
      responseType = 'career';
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('exam')) {
      responseType = 'quiz';
    }

    const responseOptions = responses[responseType];
    const response = responseOptions[Math.floor(Math.random() * responseOptions.length)];

    res.json({
      response,
      suggestions: [
        "Tell me about career opportunities in my domain",
        "What skills should I focus on next?",
        "How can I prepare for interviews?",
        "Recommend some practice resources"
      ]
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ message: 'AI Assistant temporarily unavailable' });
  }
});

// Get career recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { domain } = req.query;
    
    // Sample recommendations based on domain
    const recommendations = {
      'IT': {
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS'],
        resources: [
          { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
          { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' }
        ],
        jobTrends: 'High demand for full-stack developers and cloud engineers'
      },
      'Data-Analysis': {
        skills: ['Python', 'SQL', 'Tableau', 'Machine Learning', 'Statistics'],
        resources: [
          { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
          { title: 'Coursera Data Science', url: 'https://www.coursera.org/' }
        ],
        jobTrends: 'Growing demand for data scientists and analysts'
      },
      'Healthcare': {
        skills: ['Medical Knowledge', 'Patient Care', 'Healthcare IT', 'Compliance'],
        resources: [
          { title: 'NextGenU', url: 'https://www.nextgenu.org/' },
          { title: 'WHO Learning', url: 'https://www.who.int/' }
        ],
        jobTrends: 'Increasing opportunities in telemedicine and health tech'
      }
    };

    const domainRecommendations = recommendations[domain] || recommendations['IT'];
    
    res.json(domainRecommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;