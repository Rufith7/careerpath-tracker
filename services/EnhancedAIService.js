/**
 * Enhanced AI Service for Career Guidance and Assistance
 * Advanced Conversational AI with NLP, Intent Classification, and Context Awareness
 */

class EnhancedAIService {
  constructor() {
    this.intents = this.initializeIntents();
    this.responses = this.initializeResponses();
    this.conversationHistory = new Map();
    this.userProfiles = new Map();
    this.contextMemory = new Map();
    this.entityExtractor = this.initializeEntityExtractor();
    this.sentimentAnalyzer = this.initializeSentimentAnalyzer();
  }

  initializeIntents() {
    return {
      greeting: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'start', 'begin'],
        confidence: 0.9
      },
      help: {
        keywords: ['help', 'assist', 'support', 'guide', 'what can you do', 'capabilities', 'features'],
        confidence: 0.8
      },
      learning: {
        keywords: ['learn', 'study', 'course', 'tutorial', 'education', 'skill', 'training', 'knowledge'],
        confidence: 0.85
      },
      career: {
        keywords: ['career', 'job', 'profession', 'work', 'employment', 'opportunity', 'growth', 'advancement'],
        confidence: 0.85
      },
      quiz: {
        keywords: ['quiz', 'test', 'assessment', 'evaluation', 'exam', 'practice', 'challenge', 'question'],
        confidence: 0.9
      },
      progress: {
        keywords: ['progress', 'achievement', 'level', 'advancement', 'growth', 'status', 'completion'],
        confidence: 0.8
      },
      roadmap: {
        keywords: ['roadmap', 'path', 'plan', 'journey', 'steps', 'guide', 'strategy', 'timeline'],
        confidence: 0.85
      },
      motivation: {
        keywords: ['motivation', 'encourage', 'inspire', 'support', 'confidence', 'boost', 'morale'],
        confidence: 0.7
      },
      technical: {
        keywords: ['code', 'programming', 'development', 'technical', 'software', 'algorithm', 'debug'],
        confidence: 0.85
      },
      interview: {
        keywords: ['interview', 'preparation', 'questions', 'tips', 'practice', 'behavioral', 'technical interview'],
        confidence: 0.9
      },
      resume: {
        keywords: ['resume', 'cv', 'curriculum vitae', 'portfolio', 'profile', 'experience', 'skills'],
        confidence: 0.9
      },
      resources: {
        keywords: ['resources', 'materials', 'links', 'references', 'documentation', 'articles', 'videos'],
        confidence: 0.8
      },
      doubt: {
        keywords: ['doubt', 'confusion', 'unclear', 'explain', 'clarify', 'understand', 'meaning'],
        confidence: 0.75
      },
      feedback: {
        keywords: ['feedback', 'review', 'opinion', 'suggestion', 'improvement', 'critique'],
        confidence: 0.8
      }
    };
  }

  initializeResponses() {
    return {
      greeting: {
        responses: [
          "Hello! I'm your AI career assistant. I'm here to guide you through your learning journey and help you achieve your career goals. How can I assist you today?",
          "Hi there! Welcome to your personalized career development platform. I can help with learning recommendations, quiz preparation, career guidance, and much more. What would you like to explore?",
          "Greetings! I'm excited to help you advance your career. Whether you need study materials, want to take a quiz, or seek career advice, I'm here for you. What's on your mind?"
        ],
        followUp: ["What specific area would you like to focus on?", "Tell me about your current learning goals.", "How can I help you grow today?"]
      },
      help: {
        responses: [
          "I'm your comprehensive career assistant! Here's what I can do for you:\n\n🎯 **Career Guidance**: Personalized advice and roadmaps\n📚 **Learning Resources**: Curated materials from top platforms\n🧠 **AI Quizzes**: Adaptive assessments to test your knowledge\n📈 **Progress Tracking**: Monitor your learning journey\n💼 **Resume Enhancement**: AI-powered CV optimization\n🎤 **Interview Prep**: Practice questions and tips\n🤖 **Smart Recommendations**: Personalized suggestions based on your profile\n\nWhat would you like to start with?",
          "I'm here to accelerate your career growth! My capabilities include:\n\n✨ **Intelligent Tutoring**: Explain complex concepts simply\n🔍 **Resource Discovery**: Find the best learning materials\n📊 **Skill Assessment**: Evaluate your knowledge gaps\n🎯 **Goal Setting**: Create achievable learning milestones\n💡 **Problem Solving**: Help debug code and solve challenges\n🌟 **Motivation**: Keep you inspired throughout your journey\n\nHow can I help you succeed today?"
        ],
        followUp: ["Which feature interests you most?", "What's your primary learning goal?", "Tell me about your current challenges."]
      },
      learning: {
        responses: [
          "Excellent! Learning is the foundation of career success. I can provide personalized recommendations based on your current level, interests, and career goals. Whether you're a beginner starting fresh or an expert looking to expand, I have curated resources from platforms like freeCodeCamp, Coursera, Khan Academy, and more.",
          "I love your commitment to learning! Based on your profile and progress, I can suggest the most effective learning path. From interactive tutorials to hands-on projects, I'll ensure you get the right mix of theory and practice.",
          "Learning never stops, and I'm here to make it engaging and effective! I can recommend courses, articles, videos, and practice exercises tailored to your learning style and pace."
        ],
        followUp: ["What domain or skill interests you most?", "What's your current experience level?", "Do you prefer video tutorials or hands-on practice?"]
      },
      career: {
        responses: [
          "Career development is a strategic journey, and I'm your personal guide! I can help you identify growth opportunities, plan skill development, understand industry trends, and create actionable roadmaps. Whether you're looking to advance in your current role or transition to a new field, I have insights and resources to support you.",
          "Your career success is my mission! I can analyze your current skills, identify gaps, recommend learning paths, and help you build a compelling professional profile. From entry-level to executive positions, I understand what it takes to succeed.",
          "Let's build your dream career together! I provide data-driven insights about job markets, salary trends, required skills, and growth opportunities. Plus, I can help you prepare for interviews and optimize your resume."
        ],
        followUp: ["What's your target role or industry?", "What career challenges are you facing?", "Would you like to see your personalized career roadmap?"]
      },
      quiz: {
        responses: [
          "Fantastic choice! Our AI-powered quiz engine is designed to challenge and educate you simultaneously. I create adaptive assessments that adjust to your skill level, provide detailed explanations, and track your progress. Each quiz helps identify knowledge gaps and reinforces learning.",
          "Quizzes are one of the most effective ways to solidify knowledge! I generate questions from real industry scenarios, coding challenges, and theoretical concepts. With our 70% pass threshold system, you'll unlock new levels as you demonstrate mastery.",
          "Ready to test your knowledge? I create personalized quizzes that not only assess what you know but also teach you what you don't. Each question comes with detailed explanations and links to additional resources."
        ],
        followUp: ["Which topic would you like to be quizzed on?", "What difficulty level suits you best?", "Would you like to see your quiz history and progress?"]
      },
      progress: {
        responses: [
          "Tracking progress is crucial for motivation and growth! I maintain detailed analytics of your learning journey, including quiz scores, completed courses, time spent studying, and skill improvements. Your progress data helps me provide better recommendations and celebrate your achievements.",
          "You're making excellent progress! I can show you detailed insights about your learning patterns, strengths, areas for improvement, and upcoming milestones. Progress tracking keeps you motivated and on the right path.",
          "Every step forward counts! I track not just what you've completed, but how you're improving over time. From quiz performance to skill development, I provide comprehensive analytics to guide your learning decisions."
        ],
        followUp: ["Would you like to see your detailed progress report?", "What specific metrics interest you most?", "Shall I suggest your next learning milestone?"]
      },
      roadmap: {
        responses: [
          "A personalized roadmap is your GPS to career success! I create detailed, step-by-step learning paths based on your goals, current skills, available time, and preferred learning style. Each roadmap includes milestones, resources, projects, and assessments to keep you on track.",
          "Let me design your learning journey! I analyze thousands of successful career paths to create optimized roadmaps. Whether you want to become a software engineer, data scientist, or any other role, I'll map out the most efficient path with realistic timelines.",
          "Roadmaps transform overwhelming career goals into manageable daily actions! I break down complex skill requirements into digestible learning modules, suggest the best sequence for topics, and adapt the plan based on your progress."
        ],
        followUp: ["What's your target career goal?", "How much time can you dedicate to learning weekly?", "Do you prefer structured courses or flexible self-study?"]
      },
      motivation: {
        responses: [
          "You're absolutely crushing it! 🌟 Remember, every expert was once a beginner, and every pro was once an amateur. Your dedication to learning and growth is inspiring. The fact that you're here, actively working on your skills, puts you ahead of 90% of people. Keep pushing forward!",
          "I believe in you! 💪 Success isn't about being perfect; it's about being persistent. Every challenge you face is making you stronger and more capable. Your future self will thank you for the effort you're putting in today. You've got this!",
          "Your journey is unique and valuable! 🚀 Don't compare your chapter 1 to someone else's chapter 20. Focus on your progress, celebrate small wins, and remember that consistent effort compounds over time. You're building something amazing!"
        ],
        followUp: ["What's been your biggest learning win recently?", "How can I help you stay motivated?", "Would you like to set a new learning goal?"]
      },
      technical: {
        responses: [
          "Technical skills are your superpower in today's digital world! I can help you master programming languages, understand frameworks, debug code, learn best practices, and work on real-world projects. Whether it's web development, mobile apps, data science, or AI, I have resources and guidance for every tech domain.",
          "Coding is both an art and a science! I can explain complex technical concepts in simple terms, help you understand algorithms, review your code, suggest improvements, and guide you through challenging projects. From syntax to system design, I'm here to help.",
          "Technology evolves rapidly, but with the right guidance, you can stay ahead! I keep track of the latest trends, best practices, and industry standards. Whether you're debugging an issue or learning a new technology, I provide practical, actionable advice."
        ],
        followUp: ["What programming language or technology interests you?", "Are you working on any specific project?", "Would you like help with debugging or code review?"]
      },
      interview: {
        responses: [
          "Interview preparation is crucial for landing your dream job! I can help you practice common questions, improve your storytelling using the STAR method, prepare for technical challenges, and boost your confidence. From behavioral questions to system design, I cover all interview types.",
          "Interviews are opportunities to showcase your skills! I provide practice questions tailored to your target role, help you craft compelling answers, and offer tips for handling difficult situations. Let's turn your interview anxiety into excitement!",
          "Great interviews lead to great opportunities! I can simulate real interview scenarios, provide feedback on your responses, help you prepare questions to ask interviewers, and share insights about company cultures and expectations."
        ],
        followUp: ["What type of role are you interviewing for?", "Would you like to practice behavioral or technical questions?", "Do you need help with any specific interview challenges?"]
      },
      resume: {
        responses: [
          "Your resume is your professional story! I can help you create a compelling narrative that highlights your achievements, optimizes for ATS systems, and aligns with job requirements. From formatting to content, I ensure your resume stands out for the right reasons.",
          "A great resume opens doors! I analyze your experience, identify key achievements, suggest powerful action verbs, and help you quantify your impact. Whether you're a recent graduate or seasoned professional, I can enhance your professional profile.",
          "Let's make your resume irresistible to employers! I provide AI-powered optimization that improves keyword density, enhances readability, and ensures your unique value proposition shines through. Your resume should work as hard as you do!"
        ],
        followUp: ["What type of role are you targeting?", "Would you like me to review your current resume?", "Do you need help with any specific resume section?"]
      },
      resources: {
        responses: [
          "I have access to an extensive library of high-quality learning resources! From free platforms like freeCodeCamp and Khan Academy to premium content from Coursera and Udemy, I curate the best materials based on your learning goals, style, and current level.",
          "Finding the right resources can be overwhelming, but I've got you covered! I recommend articles, videos, tutorials, books, and interactive platforms that align with your interests. Quality over quantity - I focus on resources that deliver real value.",
          "The internet is full of learning materials, but not all are created equal! I filter through thousands of resources to recommend only the most effective, up-to-date, and engaging content. From beginner-friendly tutorials to advanced masterclasses, I have something for everyone."
        ],
        followUp: ["What specific topic do you need resources for?", "Do you prefer video content or written materials?", "What's your current skill level in this area?"]
      },
      doubt: {
        responses: [
          "No question is too small or too basic! I'm here to clarify any confusion and explain concepts in multiple ways until they click. Whether it's a technical concept, career decision, or learning strategy, I'll break it down step by step.",
          "Doubts are natural parts of learning! They show you're thinking critically and pushing your boundaries. I can explain complex topics using analogies, examples, and different perspectives to help you understand completely.",
          "I love helping clear up confusion! The best learners are those who ask questions. I can provide detailed explanations, additional resources, and practical examples to ensure you fully grasp any concept."
        ],
        followUp: ["What specific concept would you like me to explain?", "Would you like me to provide examples or analogies?", "Is there a particular aspect that's confusing you?"]
      },
      feedback: {
        responses: [
          "I value your feedback immensely! Your input helps me improve and provide better assistance. Whether it's about my responses, the platform features, or suggestions for new capabilities, I'm all ears. Your success is my success!",
          "Feedback is a gift that helps me grow! I'm constantly learning and evolving to serve you better. Please share your thoughts, suggestions, or any areas where you think I can improve. Together, we can make your learning experience exceptional.",
          "Thank you for wanting to share feedback! Your insights help me understand what's working well and what needs improvement. I'm committed to providing the best possible assistance for your career development journey."
        ],
        followUp: ["What aspect would you like to provide feedback on?", "How can I better assist you?", "Are there any features you'd like to see added?"]
      },
      default: {
        responses: [
          "That's an interesting question! While I may not have a specific answer ready, I'm here to help with your career development in any way I can. Could you provide more context about what you're looking for? I can assist with learning resources, career guidance, quizzes, resume help, and much more.",
          "I want to make sure I give you the most helpful response possible. Could you tell me more about your question or goal? I'm equipped to help with technical learning, career planning, skill assessment, interview preparation, and personal development.",
          "I'm constantly learning to better assist you! Based on your question, I can help you explore learning resources, take practice quizzes, plan your career path, or work on specific skills. What would be most valuable for you right now?"
        ],
        followUp: ["Could you be more specific about what you need help with?", "What's your main learning or career goal?", "How can I best support your professional development?"]
      }
    };
  }

  initializeEntityExtractor() {
    return {
      domains: ['IT', 'DataScience', 'Healthcare', 'Finance', 'Aptitude', 'Engineering', 'Management'],
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'SQL', 'AWS', 'Docker'],
      levels: ['beginner', 'intermediate', 'advanced', 'expert'],
      timeframes: ['today', 'this week', 'this month', 'next month', 'soon', 'later'],
      emotions: ['excited', 'confused', 'frustrated', 'motivated', 'confident', 'worried']
    };
  }

  initializeSentimentAnalyzer() {
    return {
      positive: ['great', 'excellent', 'amazing', 'love', 'fantastic', 'awesome', 'perfect', 'wonderful'],
      negative: ['difficult', 'hard', 'confused', 'frustrated', 'stuck', 'problem', 'issue', 'trouble'],
      neutral: ['okay', 'fine', 'normal', 'average', 'standard', 'regular']
    };
  }

  async processMessage(message, userId, userContext = {}) {
    try {
      // Store conversation history
      if (!this.conversationHistory.has(userId)) {
        this.conversationHistory.set(userId, []);
      }
      
      const history = this.conversationHistory.get(userId);
      history.push({ type: 'user', message, timestamp: Date.now() });

      // Extract entities and analyze sentiment
      const entities = this.extractEntities(message);
      const sentiment = this.analyzeSentiment(message);
      
      // Classify intent with confidence scoring
      const intentResult = this.classifyIntentAdvanced(message, entities, history);
      
      // Update context memory
      this.updateContextMemory(userId, entities, intentResult.intent, sentiment);
      
      // Generate contextual response
      const response = this.generateAdvancedResponse(intentResult, message, userContext, history, entities, sentiment);
      
      // Generate intelligent suggestions
      const suggestions = this.generateIntelligentSuggestions(intentResult.intent, userContext, entities);
      
      // Store AI response
      history.push({ 
        type: 'ai', 
        message: response, 
        intent: intentResult.intent, 
        confidence: intentResult.confidence,
        entities,
        sentiment,
        timestamp: Date.now() 
      });
      
      // Keep only last 20 exchanges
      if (history.length > 40) {
        history.splice(0, history.length - 40);
      }

      return {
        success: true,
        response,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        suggestions,
        entities,
        sentiment,
        conversationId: userId,
        contextualInsights: this.generateContextualInsights(userId, userContext)
      };
    } catch (error) {
      console.error('Enhanced AI Service error:', error);
      return {
        success: false,
        error: error.message,
        response: "I apologize, but I'm experiencing some technical difficulties. Let me try to help you in a different way. What specific aspect of your career development can I assist with?",
        suggestions: ['Ask about learning resources', 'Get career guidance', 'Take a practice quiz', 'Check progress']
      };
    }
  }

  extractEntities(message) {
    const entities = {
      domains: [],
      skills: [],
      levels: [],
      timeframes: [],
      emotions: []
    };

    const lowerMessage = message.toLowerCase();

    // Extract domains
    this.entityExtractor.domains.forEach(domain => {
      if (lowerMessage.includes(domain.toLowerCase())) {
        entities.domains.push(domain);
      }
    });

    // Extract skills
    this.entityExtractor.skills.forEach(skill => {
      if (lowerMessage.includes(skill.toLowerCase())) {
        entities.skills.push(skill);
      }
    });

    // Extract levels
    this.entityExtractor.levels.forEach(level => {
      if (lowerMessage.includes(level)) {
        entities.levels.push(level);
      }
    });

    // Extract timeframes
    this.entityExtractor.timeframes.forEach(timeframe => {
      if (lowerMessage.includes(timeframe)) {
        entities.timeframes.push(timeframe);
      }
    });

    // Extract emotions
    this.entityExtractor.emotions.forEach(emotion => {
      if (lowerMessage.includes(emotion)) {
        entities.emotions.push(emotion);
      }
    });

    return entities;
  }

  analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    this.sentimentAnalyzer.positive.forEach(word => {
      if (lowerMessage.includes(word)) positiveScore++;
    });

    this.sentimentAnalyzer.negative.forEach(word => {
      if (lowerMessage.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  classifyIntentAdvanced(message, entities, history) {
    const lowerMessage = message.toLowerCase();
    let bestMatch = { intent: 'default', confidence: 0 };

    Object.entries(this.intents).forEach(([intent, config]) => {
      let score = 0;
      let keywordMatches = 0;

      // Check keyword matches
      config.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          keywordMatches++;
          score += 1;
        }
      });

      // Boost score based on entities
      if (entities.domains.length > 0 && ['learning', 'career', 'quiz'].includes(intent)) {
        score += 0.5;
      }

      if (entities.skills.length > 0 && ['technical', 'learning'].includes(intent)) {
        score += 0.5;
      }

      // Context from conversation history
      if (history.length > 0) {
        const lastExchange = history[history.length - 1];
        if (lastExchange.intent === intent) {
          score += 0.3; // Conversation continuity
        }
      }

      // Calculate confidence
      const confidence = Math.min(1, (score / config.keywords.length) * config.confidence);

      if (confidence > bestMatch.confidence) {
        bestMatch = { intent, confidence };
      }
    });

    return bestMatch;
  }

  updateContextMemory(userId, entities, intent, sentiment) {
    if (!this.contextMemory.has(userId)) {
      this.contextMemory.set(userId, {
        preferences: {},
        recentTopics: [],
        emotionalState: [],
        learningGoals: []
      });
    }

    const context = this.contextMemory.get(userId);
    
    // Update recent topics
    if (entities.domains.length > 0) {
      context.recentTopics = [...new Set([...entities.domains, ...context.recentTopics])].slice(0, 5);
    }

    // Track emotional state
    context.emotionalState.push({ sentiment, timestamp: Date.now() });
    if (context.emotionalState.length > 10) {
      context.emotionalState = context.emotionalState.slice(-10);
    }

    // Update learning goals based on entities
    if (entities.skills.length > 0) {
      context.learningGoals = [...new Set([...entities.skills, ...context.learningGoals])].slice(0, 10);
    }
  }

  generateAdvancedResponse(intentResult, message, userContext, history, entities, sentiment) {
    const { intent, confidence } = intentResult;
    const responseConfig = this.responses[intent] || this.responses.default;
    let response = responseConfig.responses[Math.floor(Math.random() * responseConfig.responses.length)];

    // Add sentiment-based modifications
    if (sentiment === 'negative') {
      response = "I understand this might be challenging. " + response;
    } else if (sentiment === 'positive') {
      response = "I love your enthusiasm! " + response;
    }

    // Add entity-specific context
    if (entities.domains.length > 0) {
      response += `\n\nI see you're interested in ${entities.domains.join(' and ')}. `;
    }

    if (entities.skills.length > 0) {
      response += `Focusing on ${entities.skills.join(', ')} is a great choice for career growth. `;
    }

    if (entities.levels.length > 0) {
      response += `At the ${entities.levels[0]} level, I can provide targeted resources and guidance. `;
    }

    // Add user context
    if (userContext.selectedDomain && !entities.domains.includes(userContext.selectedDomain)) {
      response += `\n\nBased on your profile in ${userContext.selectedDomain}, `;
    }

    if (userContext.currentLevel) {
      response += `you're currently at level ${userContext.currentLevel}. `;
    }

    // Add conversation continuity
    if (history.length > 2) {
      const recentIntents = history.slice(-4).filter(h => h.type === 'ai').map(h => h.intent);
      if (recentIntents.includes('quiz') && intent === 'progress') {
        response += "\n\nSince you were asking about quizzes earlier, let me show you how your quiz performance contributes to your overall progress.";
      }
    }

    // Add confidence-based modifications
    if (confidence < 0.5) {
      response += "\n\nIf this isn't exactly what you were looking for, please feel free to clarify, and I'll provide more targeted assistance.";
    }

    return response;
  }

  generateIntelligentSuggestions(intent, userContext, entities) {
    const baseSuggestions = {
      greeting: [
        "Show me my learning dashboard",
        "What's new in my domain?",
        "Recommend today's learning goal",
        "Take a quick skill assessment"
      ],
      learning: [
        "Find courses for my level",
        "Show trending topics in my field",
        "Create a study schedule",
        "Recommend practice projects"
      ],
      quiz: [
        "Generate a personalized quiz",
        "Show my quiz performance analytics",
        "Practice interview questions",
        "Challenge me with advanced topics"
      ],
      career: [
        "Build my career roadmap",
        "Analyze job market trends",
        "Improve my professional profile",
        "Find networking opportunities"
      ],
      progress: [
        "View detailed learning analytics",
        "Set new learning milestones",
        "Compare with peer progress",
        "Celebrate recent achievements"
      ],
      technical: [
        "Debug my code",
        "Explain complex concepts",
        "Find coding challenges",
        "Review best practices"
      ],
      resume: [
        "Analyze my resume for ATS",
        "Optimize for target role",
        "Add quantifiable achievements",
        "Improve keyword density"
      ]
    };

    let suggestions = baseSuggestions[intent] || [
      "Get personalized recommendations",
      "Explore learning resources",
      "Take a practice quiz",
      "Check my progress"
    ];

    // Customize based on entities
    if (entities.domains.length > 0) {
      suggestions = suggestions.map(s => s.replace('my field', entities.domains[0]));
    }

    if (entities.skills.length > 0) {
      suggestions.push(`Learn more about ${entities.skills[0]}`);
    }

    // Add context-specific suggestions
    if (userContext.selectedDomain) {
      suggestions.push(`Explore ${userContext.selectedDomain} resources`);
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }

  generateContextualInsights(userId, userContext) {
    const insights = [];
    const context = this.contextMemory.get(userId);

    if (context) {
      // Learning pattern insights
      if (context.recentTopics.length > 2) {
        insights.push(`You've been exploring ${context.recentTopics.slice(0, 3).join(', ')} recently. Great breadth of learning!`);
      }

      // Emotional state insights
      const recentSentiments = context.emotionalState.slice(-5).map(e => e.sentiment);
      const positiveCount = recentSentiments.filter(s => s === 'positive').length;
      if (positiveCount >= 3) {
        insights.push("You seem motivated and engaged in your learning journey!");
      }

      // Goal alignment insights
      if (context.learningGoals.length > 0 && userContext.selectedDomain) {
        const alignedGoals = context.learningGoals.filter(goal => 
          this.entityExtractor.skills.includes(goal)
        );
        if (alignedGoals.length > 0) {
          insights.push(`Your focus on ${alignedGoals[0]} aligns well with your ${userContext.selectedDomain} domain.`);
        }
      }
    }

    // Progress-based insights
    if (userContext.progress) {
      const completedDomains = Object.keys(userContext.progress).length;
      if (completedDomains > 1) {
        insights.push(`You're making excellent progress across ${completedDomains} domains!`);
      }
    }

    return insights.length > 0 ? insights : ["Keep up the great work on your learning journey!"];
  }

  // Enhanced conversation history with analytics
  getConversationHistory(userId, limit = 10) {
    const history = this.conversationHistory.get(userId) || [];
    const recentHistory = history.slice(-limit * 2);
    
    // Add analytics
    const analytics = {
      totalExchanges: history.length / 2,
      topIntents: this.getTopIntents(history),
      averageConfidence: this.getAverageConfidence(history),
      sentimentTrend: this.getSentimentTrend(history)
    };

    return { history: recentHistory, analytics };
  }

  getTopIntents(history) {
    const intentCounts = {};
    history.filter(h => h.type === 'ai' && h.intent).forEach(h => {
      intentCounts[h.intent] = (intentCounts[h.intent] || 0) + 1;
    });
    
    return Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([intent, count]) => ({ intent, count }));
  }

  getAverageConfidence(history) {
    const confidenceScores = history
      .filter(h => h.type === 'ai' && h.confidence)
      .map(h => h.confidence);
    
    return confidenceScores.length > 0 
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length 
      : 0;
  }

  getSentimentTrend(history) {
    const sentiments = history
      .filter(h => h.type === 'ai' && h.sentiment)
      .slice(-5)
      .map(h => h.sentiment);
    
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    
    if (positive > negative) return 'improving';
    if (negative > positive) return 'declining';
    return 'stable';
  }

  // Generate comprehensive user insights
  generateComprehensiveInsights(userId, userContext) {
    const context = this.contextMemory.get(userId);
    const history = this.conversationHistory.get(userId) || [];
    
    return {
      learningProfile: this.analyzeLearningProfile(context, userContext),
      engagementLevel: this.calculateEngagementLevel(history),
      recommendedActions: this.generateRecommendedActions(context, userContext),
      strengthsAndGaps: this.identifyStrengthsAndGaps(context, userContext)
    };
  }

  analyzeLearningProfile(context, userContext) {
    if (!context) return { type: 'new_learner', characteristics: [] };

    const characteristics = [];
    
    if (context.recentTopics.length > 3) {
      characteristics.push('curious_explorer');
    }
    
    if (context.learningGoals.length > 5) {
      characteristics.push('goal_oriented');
    }

    const positiveInteractions = context.emotionalState.filter(e => e.sentiment === 'positive').length;
    if (positiveInteractions > context.emotionalState.length * 0.7) {
      characteristics.push('motivated_learner');
    }

    return {
      type: characteristics.length > 0 ? 'active_learner' : 'casual_learner',
      characteristics
    };
  }

  calculateEngagementLevel(history) {
    if (history.length === 0) return 'new';
    
    const recentActivity = history.filter(h => 
      Date.now() - h.timestamp < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    ).length;

    if (recentActivity > 20) return 'highly_engaged';
    if (recentActivity > 10) return 'moderately_engaged';
    if (recentActivity > 5) return 'lightly_engaged';
    return 'inactive';
  }

  generateRecommendedActions(context, userContext) {
    const actions = [];

    if (context?.recentTopics.length > 0) {
      actions.push({
        type: 'continue_learning',
        description: `Continue exploring ${context.recentTopics[0]}`,
        priority: 'high'
      });
    }

    if (userContext.selectedDomain) {
      actions.push({
        type: 'take_quiz',
        description: `Take a ${userContext.selectedDomain} assessment`,
        priority: 'medium'
      });
    }

    actions.push({
      type: 'set_goal',
      description: 'Set a new learning milestone',
      priority: 'low'
    });

    return actions;
  }

  identifyStrengthsAndGaps(context, userContext) {
    const strengths = [];
    const gaps = [];

    if (context?.learningGoals.length > 3) {
      strengths.push('Goal-oriented learning approach');
    }

    if (userContext.progress && Object.keys(userContext.progress).length > 1) {
      strengths.push('Multi-domain expertise development');
    }

    // Identify gaps based on common career requirements
    if (userContext.selectedDomain === 'IT' && !context?.learningGoals.includes('JavaScript')) {
      gaps.push('JavaScript fundamentals');
    }

    return { strengths, gaps };
  }
}

module.exports = EnhancedAIService;