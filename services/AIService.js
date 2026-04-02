const AIInteraction = require('../models/AIInteraction');
const User = require('../models/User');
const Domain = require('../models/Domain');

class AIService {
  constructor() {
    this.intents = {
      career_guidance: ['career', 'job', 'future', 'path', 'guidance', 'advice'],
      course_recommendation: ['course', 'learn', 'study', 'recommend', 'suggest'],
      skill_assessment: ['skill', 'level', 'assess', 'evaluate', 'proficiency'],
      interview_prep: ['interview', 'preparation', 'questions', 'practice'],
      resume_help: ['resume', 'cv', 'portfolio', 'profile'],
      learning_path: ['roadmap', 'path', 'journey', 'progression'],
      motivation: ['motivation', 'encourage', 'inspire', 'support'],
      technical_question: ['how', 'what', 'explain', 'technical', 'code'],
      general_query: ['help', 'info', 'about', 'general']
    };

    this.responses = {
      career_guidance: [
        "Based on your profile and current market trends, I can help you explore exciting career opportunities in {domain}.",
        "Your career journey is unique! Let me analyze your skills and suggest the best path forward.",
        "The {domain} field has excellent growth prospects. Here's what I recommend for your career development."
      ],
      course_recommendation: [
        "I've found some excellent courses that match your learning style and career goals.",
        "Based on your current progress, these courses will help you advance to the next level.",
        "Here are some highly-rated courses that align with your interests in {domain}."
      ],
      skill_assessment: [
        "Let me evaluate your current skill level and identify areas for improvement.",
        "Your skill profile shows great potential! Here's how you can enhance your expertise.",
        "Based on industry standards, here's where you stand and how to level up."
      ],
      interview_prep: [
        "Interview preparation is crucial for success. Let me help you practice and improve.",
        "I'll guide you through common interview questions and best practices for {domain}.",
        "Your interview skills can make or break opportunities. Let's work on them together."
      ],
      resume_help: [
        "A strong resume is your ticket to great opportunities. Let me help you craft one.",
        "Your achievements deserve to shine! I'll help you present them effectively.",
        "Let's create a compelling resume that highlights your {domain} expertise."
      ],
      learning_path: [
        "Every expert was once a beginner. Here's your personalized learning roadmap.",
        "Your learning journey in {domain} should be strategic and focused. Here's how.",
        "I've created a step-by-step path to help you achieve your career goals."
      ],
      motivation: [
        "You're doing great! Every step forward is progress worth celebrating.",
        "Learning is a journey, not a destination. Keep pushing forward!",
        "Your dedication to growth is inspiring. Let's keep building your future together."
      ],
      technical_question: [
        "Great question! Let me break this down in a way that's easy to understand.",
        "Technical concepts can be complex, but I'll explain it step by step.",
        "Understanding the fundamentals is key. Here's what you need to know."
      ],
      general_query: [
        "I'm here to help with all your career development needs. What would you like to know?",
        "Feel free to ask me anything about learning, careers, or skill development.",
        "I'm your AI career mentor, ready to assist you on your professional journey."
      ]
    };

    this.suggestions = {
      career_guidance: [
        "Explore salary trends in your field",
        "Find job opportunities near you",
        "Connect with industry professionals",
        "Learn about emerging technologies"
      ],
      course_recommendation: [
        "View your personalized learning path",
        "Check course prerequisites",
        "See student reviews and ratings",
        "Find free alternatives"
      ],
      skill_assessment: [
        "Take a skill assessment quiz",
        "Compare with industry standards",
        "Get personalized improvement plan",
        "Track your progress over time"
      ],
      interview_prep: [
        "Practice with mock interviews",
        "Review common questions",
        "Improve your communication skills",
        "Learn about company culture"
      ],
      resume_help: [
        "Use our AI resume builder",
        "Get template suggestions",
        "Optimize for ATS systems",
        "Add relevant keywords"
      ]
    };
  }

  // Analyze user query and determine intent
  analyzeIntent(query) {
    const lowerQuery = query.toLowerCase();
    let bestMatch = 'general_query';
    let maxScore = 0;

    for (const [intent, keywords] of Object.entries(this.intents)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerQuery.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = intent;
      }
    }

    return bestMatch;
  }

  // Generate contextual response
  async generateResponse(userId, query, context = {}) {
    try {
      const startTime = Date.now();
      
      // Get user data for personalization
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Analyze intent
      const intent = this.analyzeIntent(query);
      
      // Get domain information if available
      let domainInfo = null;
      if (user.selectedDomain) {
        domainInfo = await Domain.findOne({ name: user.selectedDomain });
      }

      // Generate personalized response
      const responseTemplates = this.responses[intent] || this.responses.general_query;
      let response = responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
      
      // Personalize response
      response = response.replace('{domain}', user.selectedDomain || 'your chosen field');
      response = response.replace('{name}', user.name);
      response = response.replace('{level}', user.progress.currentLevel);

      // Add specific recommendations based on intent
      const recommendations = await this.getRecommendations(intent, user, domainInfo);
      if (recommendations.length > 0) {
        response += "\n\nHere are some specific recommendations for you:\n" + 
                   recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
      }

      // Get suggestions
      const suggestions = this.suggestions[intent] || this.suggestions.career_guidance;

      const processingTime = Date.now() - startTime;

      // Save interaction
      const interaction = new AIInteraction({
        userId,
        sessionId: context.sessionId || 'default',
        query,
        intent,
        context,
        response,
        suggestions,
        processingTime
      });

      await interaction.save();

      return {
        response,
        intent,
        suggestions,
        recommendations: recommendations.slice(0, 3), // Limit to top 3
        processingTime
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        intent: 'error',
        suggestions: ['Try rephrasing your question', 'Contact support if the issue persists'],
        processingTime: 0
      };
    }
  }

  // Get personalized recommendations
  async getRecommendations(intent, user, domainInfo) {
    const recommendations = [];

    switch (intent) {
      case 'career_guidance':
        if (domainInfo) {
          recommendations.push(`Consider specializing in ${domainInfo.marketTrends.topSkills[0]} - it's in high demand`);
          recommendations.push(`Average salary in ${user.selectedDomain} is $${domainInfo.marketTrends.averageSalary || 'competitive'}`);
        }
        recommendations.push(`You're at level ${user.progress.currentLevel} - focus on advancing to the next milestone`);
        break;

      case 'course_recommendation':
        if (user.progress.completedCourses.length === 0) {
          recommendations.push('Start with foundational courses in your domain');
        } else {
          recommendations.push('Consider intermediate courses to build on your foundation');
        }
        recommendations.push('Look for courses with hands-on projects');
        break;

      case 'skill_assessment':
        recommendations.push(`You've completed ${user.progress.completedCourses.length} courses so far`);
        recommendations.push('Take skill-specific quizzes to identify gaps');
        break;

      case 'interview_prep':
        recommendations.push('Practice behavioral questions using the STAR method');
        recommendations.push('Research common technical questions in your field');
        break;

      case 'resume_help':
        recommendations.push('Highlight your completed courses and certifications');
        recommendations.push('Include relevant projects from your learning journey');
        break;

      default:
        recommendations.push('Explore your personalized dashboard for insights');
        break;
    }

    return recommendations;
  }

  // Get user interaction history
  async getInteractionHistory(userId, limit = 10) {
    return await AIInteraction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('query response intent satisfaction timestamp');
  }

  // Analyze user satisfaction
  async analyzeSatisfaction(userId) {
    const interactions = await AIInteraction.find({ 
      userId, 
      satisfaction: { $exists: true } 
    });

    if (interactions.length === 0) return null;

    const avgSatisfaction = interactions.reduce((sum, interaction) => 
      sum + interaction.satisfaction, 0) / interactions.length;

    const intentSatisfaction = {};
    interactions.forEach(interaction => {
      if (!intentSatisfaction[interaction.intent]) {
        intentSatisfaction[interaction.intent] = [];
      }
      intentSatisfaction[interaction.intent].push(interaction.satisfaction);
    });

    // Calculate average satisfaction per intent
    Object.keys(intentSatisfaction).forEach(intent => {
      const scores = intentSatisfaction[intent];
      intentSatisfaction[intent] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return {
      overall: avgSatisfaction,
      byIntent: intentSatisfaction,
      totalInteractions: interactions.length
    };
  }
}

module.exports = new AIService();