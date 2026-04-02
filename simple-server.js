const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const { 
  users, 
  courses, 
  domains, 
  aptitudeResources, 
  interviewResources 
} = require('./simple-auth');

// Import AI Quiz Generator for in-memory quiz generation
const AIQuizGenerator = require('./services/AIQuizGenerator');
const EnhancedAIService = require('./services/EnhancedAIService');
const ResourceRecommendationEngine = require('./services/ResourceRecommendationEngine');
const ResumeEnhancementEngine = require('./services/ResumeEnhancementEngine');
const CourseDatabase = require('./services/CourseDatabase');

// Import route handlers
const resumeRoutes = require('./routes/resume');
const recommendationRoutes = require('./routes/recommendations');
const careerRecommendationRoutes = require('./routes/careerRecommendation');

const app = express();
const PORT = 5001;
const JWT_SECRET = 'your_jwt_secret_key_here';

// In-memory quiz storage
let quizQuestions = [];
let quizAttempts = [];

// Initialize AI services
const enhancedAI = new EnhancedAIService();
const recommendationEngine = new ResourceRecommendationEngine();
const resumeEngine = new ResumeEnhancementEngine();
const courseDatabase = new CourseDatabase();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Auth middleware
const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully, userId:', decoded.userId);
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Registration attempt:', { name, email, passwordLength: password?.length });

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists (case insensitive)
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      selectedDomain: null,
      progress: {
        currentLevel: 1,
        completedCourses: [],
        completionPercentage: 0,
        quizScores: [],
        IT: { currentLevel: 1, unlockedLevels: [1] },
        DataScience: { currentLevel: 1, unlockedLevels: [1] },
        Healthcare: { currentLevel: 1, unlockedLevels: [1] },
        Finance: { currentLevel: 1, unlockedLevels: [1] },
        Aptitude: { currentLevel: 1, unlockedLevels: [1] },
        Interview: { currentLevel: 1, unlockedLevels: [1] }
      },
      achievements: [
        {
          title: 'Welcome Aboard!',
          description: 'Successfully created your account',
          earnedAt: new Date(),
          badgeIcon: 'star'
        }
      ]
    };

    users.push(newUser);
    console.log('New user created:', { id: newUser.id, email: newUser.email });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        selectedDomain: newUser.selectedDomain,
        progress: newUser.progress
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists (case insensitive email)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { id: user.id, email: user.email });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('Login successful for user:', user.email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        selectedDomain: user.selectedDomain,
        progress: user.progress
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
app.get('/api/auth/me', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/api/auth/profile', auth, (req, res) => {
  try {
    const { selectedDomain } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (selectedDomain) {
      users[userIndex].selectedDomain = selectedDomain;
    }

    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Get domains
app.get('/api/domains', auth, (req, res) => {
  try {
    // Enhance domains with course data from CourseDatabase
    const enhancedDomains = domains.map(domain => {
      const domainCourses = courseDatabase.getCoursesByDomain(domain.id);
      return {
        ...domain,
        courseCount: domainCourses ? domainCourses.courses.length : 0,
        coursesAvailable: !!domainCourses
      };
    });
    
    res.json(enhancedDomains);
  } catch (error) {
    console.error('Get domains error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses
app.get('/api/courses', auth, (req, res) => {
  try {
    // Get courses from CourseDatabase instead of simple-auth
    const allCourses = courseDatabase.getAllCourses();
    res.json(allCourses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses by domain
app.get('/api/courses/domain/:domainId', auth, (req, res) => {
  try {
    const { domainId } = req.params;
    const domainCourses = courseDatabase.getCoursesByDomain(domainId);
    
    if (!domainCourses) {
      return res.status(404).json({ message: 'Domain not found' });
    }
    
    res.json(domainCourses);
  } catch (error) {
    console.error('Get domain courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
app.get('/api/courses/:courseId', auth, (req, res) => {
  try {
    const { courseId } = req.params;
    const course = courseDatabase.getCourseById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search courses
app.get('/api/courses/search/:query', auth, (req, res) => {
  try {
    const { query } = req.params;
    const searchResults = courseDatabase.searchCourses(query);
    res.json(searchResults);
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended courses for user
app.get('/api/courses/recommendations', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      selectedDomain: user.selectedDomain,
      currentLevel: user.progress?.currentLevel || 1,
      interests: user.profile?.interests || [],
      goals: user.profile?.goals || []
    };

    const recommendations = courseDatabase.getRecommendedCourses(userProfile);
    res.json(recommendations);
  } catch (error) {
    console.error('Get course recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course statistics
app.get('/api/courses/stats', auth, (req, res) => {
  try {
    const stats = courseDatabase.getCourseStats();
    res.json(stats);
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get aptitude resources
app.get('/api/aptitude', auth, (req, res) => {
  try {
    res.json(aptitudeResources);
  } catch (error) {
    console.error('Get aptitude resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get interview resources
app.get('/api/interview', auth, (req, res) => {
  try {
    res.json(interviewResources);
  } catch (error) {
    console.error('Get interview resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// QUIZ ROUTES

// Generate quiz for specific domain, topic, and level
app.post('/api/quiz/generate', auth, async (req, res) => {
  try {
    const { domain, topic, level, difficulty = 'Medium', questionCount = 10 } = req.body;

    if (!domain || !topic || !level) {
      return res.status(400).json({ 
        message: 'Domain, topic, and level are required' 
      });
    }

    // Generate quiz using AI (in-memory version)
    const questions = await generateInMemoryQuiz(domain, topic, level, difficulty, questionCount);

    // Remove correct answers from response
    const questionsForFrontend = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options.map((opt, index) => ({
        text: opt.text,
        index: index
      })),
      estimatedTime: q.estimatedTime,
      difficulty: q.difficulty,
      topic: q.topic
    }));

    res.json({
      success: true,
      quiz: {
        domain,
        topic,
        level,
        difficulty,
        totalQuestions: questions.length,
        estimatedTime: questions.reduce((total, q) => total + q.estimatedTime, 0),
        questions: questionsForFrontend
      }
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      message: 'Error generating quiz',
      error: error.message 
    });
  }
});

// Get available topics for a domain (must come before /:domain/:level route)
app.get('/api/quiz/topics/:domain', auth, (req, res) => {
  try {
    const { domain } = req.params;
    
    // Return predefined topics based on domain
    const topicsByDomain = {
      'IT': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Databases'],
      'DataScience': ['Statistics', 'Machine Learning', 'Python', 'R', 'Data Visualization'],
      'Healthcare': ['Anatomy', 'Pharmacology', 'Medical Ethics', 'Patient Care'],
      'Finance': ['Financial Analysis', 'Investment', 'Risk Management', 'Accounting'],
      'Aptitude': ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
      'Interview': ['Behavioral Questions', 'Technical Questions', 'Communication Skills', 'Problem Solving']
    };

    const topics = topicsByDomain[domain] || ['General'];

    res.json({
      success: true,
      topics
    });

  } catch (error) {
    console.error('Topics fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching topics',
      error: error.message 
    });
  }
});

// Get quiz by domain and level
app.get('/api/quiz/:domain/:level', auth, async (req, res) => {
  try {
    const { domain, level } = req.params;
    const { topic = 'General', difficulty = 'Medium', limit = 10 } = req.query;

    // Generate questions for the quiz
    const questions = await generateInMemoryQuiz(domain, topic, parseInt(level), difficulty, parseInt(limit));

    const questionsForFrontend = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options.map((opt, index) => ({
        text: opt.text,
        index: index
      })),
      estimatedTime: q.estimatedTime,
      difficulty: q.difficulty,
      topic: q.topic
    }));

    res.json({
      success: true,
      questions: questionsForFrontend,
      generated: true
    });

  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz',
      error: error.message 
    });
  }
});

// Submit quiz attempt
app.post('/api/quiz/submit', auth, async (req, res) => {
  try {
    const { 
      domain, 
      topic, 
      level, 
      answers, 
      timeSpent,
      difficulty = 'Medium'
    } = req.body;

    if (!domain || !topic || !level || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        message: 'Invalid quiz submission data' 
      });
    }

    // Find the original questions with correct answers
    const questionIds = answers.map(a => a.questionId);
    const questions = quizQuestions.filter(q => questionIds.includes(q._id));

    if (questions.length !== answers.length) {
      return res.status(400).json({ 
        message: 'Question count mismatch' 
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const question = questions.find(q => q._id === answer.questionId);
      
      if (!question) continue;

      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
      const isCorrect = answer.selectedOption === correctOptionIndex;
      
      if (isCorrect) correctAnswers++;

      detailedAnswers.push({
        questionId: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeSpent: answer.timeSpent || 0,
        correctAnswer: correctOptionIndex,
        explanation: question.explanation
      });
    }

    const score = Math.round((correctAnswers / answers.length) * 100);
    const passed = score >= 70; // 70% pass threshold

    // Create quiz attempt record
    const quizAttempt = {
      id: String(quizAttempts.length + 1),
      userId: req.userId,
      domain,
      topic,
      level: parseInt(level),
      questions: detailedAnswers,
      score,
      totalQuestions: answers.length,
      correctAnswers,
      timeSpent: timeSpent || 0,
      passed,
      difficulty,
      passThreshold: 70,
      createdAt: new Date()
    };

    // Determine feedback and next actions
    let feedback = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    let nextLevelUnlocked = false;
    let retryRecommended = false;
    let practiceRecommended = false;

    if (score >= 80) {
      nextLevelUnlocked = true;
      feedback.strengths.push(`Excellent performance in ${domain} Level ${level}`);
      feedback.recommendations.push(`Ready to advance to Level ${level + 1}`);
      
      // Update user progress
      const userIndex = users.findIndex(u => u.id === req.userId);
      if (userIndex !== -1) {
        if (!users[userIndex].progress[domain]) {
          users[userIndex].progress[domain] = { currentLevel: 1, unlockedLevels: [1] };
        }
        
        const nextLevel = parseInt(level) + 1;
        if (!users[userIndex].progress[domain].unlockedLevels.includes(nextLevel)) {
          users[userIndex].progress[domain].unlockedLevels.push(nextLevel);
        }
        users[userIndex].progress[domain].currentLevel = Math.max(
          nextLevel,
          users[userIndex].progress[domain].currentLevel
        );
      }
    } else if (score >= 50) {
      retryRecommended = true;
      feedback.recommendations.push(`Review the topics and retry Level ${level}`);
    } else {
      practiceRecommended = true;
      feedback.weaknesses.push(`Need more practice in ${domain} fundamentals`);
      feedback.recommendations.push(`Complete practice exercises before retrying`);
    }

    quizAttempt.nextLevelUnlocked = nextLevelUnlocked;
    quizAttempt.retryRecommended = retryRecommended;
    quizAttempt.practiceRecommended = practiceRecommended;
    quizAttempt.feedback = feedback;

    quizAttempts.push(quizAttempt);

    res.json({
      success: true,
      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions: answers.length,
        timeSpent: timeSpent || 0,
        nextLevelUnlocked,
        retryRecommended,
        practiceRecommended,
        feedback,
        detailedAnswers: detailedAnswers.map(a => ({
          questionId: a.questionId,
          isCorrect: a.isCorrect,
          selectedOption: a.selectedOption,
          correctAnswer: a.correctAnswer,
          explanation: a.explanation
        }))
      }
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting quiz',
      error: error.message 
    });
  }
});

// Get user's quiz history
app.get('/api/quiz/history', auth, (req, res) => {
  try {
    const { domain, limit = 10 } = req.query;
    
    let userAttempts = quizAttempts.filter(attempt => attempt.userId === req.userId);
    
    if (domain) {
      userAttempts = userAttempts.filter(attempt => attempt.domain === domain);
    }

    userAttempts = userAttempts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      attempts: userAttempts
    });

  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz history',
      error: error.message 
    });
  }
});

// Get quiz statistics for a domain
app.get('/api/quiz/stats/:domain', auth, (req, res) => {
  try {
    const { domain } = req.params;
    
    const userAttempts = quizAttempts.filter(
      attempt => attempt.userId === req.userId && attempt.domain === domain
    );

    const statsByLevel = {};
    let totalQuizzes = 0;
    let totalPassed = 0;
    let totalScore = 0;
    let totalTime = 0;

    userAttempts.forEach(attempt => {
      const level = attempt.level;
      
      if (!statsByLevel[level]) {
        statsByLevel[level] = {
          totalAttempts: 0,
          passedAttempts: 0,
          totalScore: 0,
          bestScore: 0,
          totalTimeSpent: 0
        };
      }

      statsByLevel[level].totalAttempts++;
      statsByLevel[level].totalScore += attempt.score;
      statsByLevel[level].bestScore = Math.max(statsByLevel[level].bestScore, attempt.score);
      statsByLevel[level].totalTimeSpent += attempt.timeSpent;
      
      if (attempt.passed) {
        statsByLevel[level].passedAttempts++;
        totalPassed++;
      }

      totalQuizzes++;
      totalScore += attempt.score;
      totalTime += attempt.timeSpent;
    });

    // Convert to array format
    const byLevel = Object.keys(statsByLevel).map(level => ({
      _id: parseInt(level),
      totalAttempts: statsByLevel[level].totalAttempts,
      passedAttempts: statsByLevel[level].passedAttempts,
      averageScore: Math.round(statsByLevel[level].totalScore / statsByLevel[level].totalAttempts),
      bestScore: statsByLevel[level].bestScore,
      totalTimeSpent: statsByLevel[level].totalTimeSpent
    })).sort((a, b) => a._id - b._id);

    res.json({
      success: true,
      stats: {
        byLevel,
        overall: {
          totalQuizzes,
          totalPassed,
          overallAverage: totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0,
          totalLearningTime: totalTime
        }
      }
    });

  } catch (error) {
    console.error('Quiz stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching quiz statistics',
      error: error.message 
    });
  }
});

// Get progress
app.get('/api/progress', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progressData = {
      ...user.progress,
      totalCourses: courses.length,
      completionPercentage: courses.length > 0 
        ? Math.round((user.progress.completedCourses.length / courses.length) * 100)
        : 0
    };

    res.json(progressData);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Use AI Intelligence routes
app.use('/api/resume', resumeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/career', careerRecommendationRoutes);

// Enhanced AI Assistant routes
app.post('/api/ai-assistant/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Get user context
    const user = users.find(u => u.id === userId);
    const userContext = {
      selectedDomain: user?.selectedDomain,
      currentLevel: user?.progress?.currentLevel,
      progress: user?.progress || {},
      interests: user?.profile?.interests || [],
      goals: user?.profile?.goals || []
    };

    // Use enhanced AI service
    const result = await enhancedAI.processMessage(message, userId, userContext);
    
    res.json({
      success: true,
      response: result.response,
      intent: result.intent,
      confidence: result.confidence,
      suggestions: result.suggestions,
      entities: result.entities,
      sentiment: result.sentiment,
      contextualInsights: result.contextualInsights
    });
  } catch (error) {
    console.error('Enhanced AI Assistant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'AI Assistant temporarily unavailable',
      response: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment."
    });
  }
});

// AI Assistant conversation history
app.get('/api/ai-assistant/history', auth, (req, res) => {
  try {
    const userId = req.userId;
    const { limit } = req.query;
    
    const history = enhancedAI.getConversationHistory(userId, parseInt(limit) || 10);
    
    res.json({
      success: true,
      history: history.history,
      analytics: history.analytics
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: 'Failed to get conversation history' });
  }
});

// AI Assistant insights
app.get('/api/ai-assistant/insights', auth, (req, res) => {
  try {
    const userId = req.userId;
    const user = users.find(u => u.id === userId);
    
    const userContext = {
      selectedDomain: user?.selectedDomain,
      currentLevel: user?.progress?.currentLevel,
      progress: user?.progress || {},
      interests: user?.profile?.interests || [],
      goals: user?.profile?.goals || []
    };

    const insights = enhancedAI.generateComprehensiveInsights(userId, userContext);
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ success: false, message: 'Failed to get AI insights' });
  }
});

// AI Assistant chat
// Legacy AI Assistant (keeping for backward compatibility)
app.post('/api/ai-assistant/chat-legacy', auth, (req, res) => {
  try {
    const { message } = req.body;
    
    const responses = [
      "Hello! I'm your AI career assistant. How can I help you today?",
      "That's a great question! Let me help you with that.",
      "Based on current market trends, this skill is in high demand.",
      "I recommend taking notes while studying for better retention.",
      "Great job on your progress! Keep up the excellent work!",
      "Have you checked out the learning resources in your domain? They're comprehensive and free!",
      "Consider practicing with our aptitude and interview preparation tools.",
      "Your learning journey is unique - focus on consistent progress over speed.",
      "Try taking a quiz to test your knowledge and unlock the next level!"
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    res.json({
      response,
      suggestions: [
        "Tell me about career opportunities in my domain",
        "What skills should I focus on next?",
        "How can I prepare for interviews?",
        "Recommend some practice resources",
        "Show me aptitude test resources",
        "Help me create a study plan",
        "Generate a quiz for my current level"
      ]
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ message: 'AI Assistant temporarily unavailable' });
  }
});

// Helper function to generate in-memory quiz
async function generateInMemoryQuiz(domain, topic, level, difficulty, questionCount) {
  const questions = [];
  
  // Use enhanced AI Quiz Generator for 50% of questions
  if (Math.random() > 0.5) {
    try {
      const aiQuestions = await AIQuizGenerator.generateQuiz(domain, topic, level, difficulty, Math.ceil(questionCount / 2));
      questions.push(...aiQuestions.slice(0, Math.ceil(questionCount / 2)));
    } catch (error) {
      console.log('AI Generator not available, using fallback questions');
    }
  }
  
  // Generate remaining questions using existing system
  const remainingCount = questionCount - questions.length;
  for (let i = 0; i < remainingCount; i++) {
    const questionId = `${domain}_${topic}_${level}_${difficulty}_${Date.now()}_${i}`;
    let questionData;

    // Generate different types of questions based on domain
    switch (domain) {
      case 'IT':
        questionData = generateITQuestion(topic, difficulty);
        break;
      case 'DataScience':
        questionData = generateDataScienceQuestion(topic, difficulty);
        break;
      case 'Healthcare':
        questionData = generateHealthcareQuestion(topic, difficulty);
        break;
      case 'Finance':
        questionData = generateFinanceQuestion(topic, difficulty);
        break;
      case 'Aptitude':
        questionData = generateAptitudeQuestion(topic, difficulty);
        break;
      case 'Interview':
        questionData = generateInterviewQuestion(topic, difficulty);
        break;
      default:
        questionData = generateGenericQuestion(topic, difficulty);
    }

    const question = {
      _id: questionId,
      domain,
      topic,
      level,
      difficulty,
      ...questionData,
      estimatedTime: getEstimatedTime(difficulty),
      aiGenerated: true,
      validated: true,
      practicalFocus: true,
      industryRelevant: true
    };

    questions.push(question);
    quizQuestions.push(question); // Store for later retrieval
  }

  return questions;
}

// Question generation functions
function generateITQuestion(topic, difficulty) {
  const questions = {
    'HTML': {
      'Easy': [
        {
          question: "What does HTML stand for?",
          options: [
            { text: "Hyper Text Markup Language", isCorrect: true },
            { text: "High Tech Modern Language", isCorrect: false },
            { text: "Home Tool Markup Language", isCorrect: false },
            { text: "Hyperlink and Text Markup Language", isCorrect: false }
          ],
          explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
        }
      ],
      'Medium': [
        {
          question: "Which HTML attribute is used to define inline styles?",
          options: [
            { text: "style", isCorrect: true },
            { text: "class", isCorrect: false },
            { text: "font", isCorrect: false },
            { text: "styles", isCorrect: false }
          ],
          explanation: "The 'style' attribute is used to define inline CSS styles for HTML elements."
        }
      ]
    },
    'JavaScript': {
      'Easy': [
        {
          question: "Which of the following is the correct way to declare a variable in JavaScript?",
          options: [
            { text: "let myVar;", isCorrect: true },
            { text: "variable myVar;", isCorrect: false },
            { text: "v myVar;", isCorrect: false },
            { text: "declare myVar;", isCorrect: false }
          ],
          explanation: "'let' is the modern way to declare variables in JavaScript, along with 'const' and 'var'."
        },
        {
          question: "What is the correct way to write a JavaScript array?",
          options: [
            { text: "var colors = ['red', 'green', 'blue']", isCorrect: true },
            { text: "var colors = (1:'red', 2:'green', 3:'blue')", isCorrect: false },
            { text: "var colors = 'red', 'green', 'blue'", isCorrect: false },
            { text: "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')", isCorrect: false }
          ],
          explanation: "JavaScript arrays are written with square brackets and comma-separated values."
        },
        {
          question: "How do you write 'Hello World' in an alert box?",
          options: [
            { text: "alert('Hello World');", isCorrect: true },
            { text: "msg('Hello World');", isCorrect: false },
            { text: "alertBox('Hello World');", isCorrect: false },
            { text: "msgBox('Hello World');", isCorrect: false }
          ],
          explanation: "The alert() function displays an alert box with a specified message."
        },
        {
          question: "Which operator is used to assign a value to a variable?",
          options: [
            { text: "=", isCorrect: true },
            { text: "*", isCorrect: false },
            { text: "-", isCorrect: false },
            { text: "x", isCorrect: false }
          ],
          explanation: "The = operator is used for assignment in JavaScript."
        },
        {
          question: "What will the following code return: Boolean(10 > 9)?",
          options: [
            { text: "true", isCorrect: true },
            { text: "false", isCorrect: false },
            { text: "NaN", isCorrect: false },
            { text: "undefined", isCorrect: false }
          ],
          explanation: "10 > 9 evaluates to true, and Boolean(true) returns true."
        }
      ],
      'Medium': [
        {
          question: "Which method can be used to find the length of a string?",
          options: [
            { text: "length", isCorrect: true },
            { text: "size", isCorrect: false },
            { text: "len", isCorrect: false },
            { text: "count", isCorrect: false }
          ],
          explanation: "The length property returns the number of characters in a string."
        },
        {
          question: "What is the correct way to write a JavaScript function?",
          options: [
            { text: "function myFunction() {}", isCorrect: true },
            { text: "function = myFunction() {}", isCorrect: false },
            { text: "function:myFunction() {}", isCorrect: false },
            { text: "create myFunction() {}", isCorrect: false }
          ],
          explanation: "Functions in JavaScript are declared using the 'function' keyword followed by the function name."
        },
        {
          question: "How do you call a function named 'myFunction'?",
          options: [
            { text: "myFunction()", isCorrect: true },
            { text: "call myFunction()", isCorrect: false },
            { text: "call function myFunction()", isCorrect: false },
            { text: "Call.myFunction()", isCorrect: false }
          ],
          explanation: "Functions are called by writing the function name followed by parentheses."
        },
        {
          question: "What does '===' operator do in JavaScript?",
          options: [
            { text: "Checks for strict equality (value and type)", isCorrect: true },
            { text: "Assigns a value", isCorrect: false },
            { text: "Checks for loose equality only", isCorrect: false },
            { text: "Compares only types", isCorrect: false }
          ],
          explanation: "The '===' operator checks for strict equality, comparing both value and data type."
        },
        {
          question: "How do you create an object in JavaScript?",
          options: [
            { text: "var obj = {}", isCorrect: true },
            { text: "var obj = []", isCorrect: false },
            { text: "var obj = ()", isCorrect: false },
            { text: "var obj = new Array()", isCorrect: false }
          ],
          explanation: "Objects in JavaScript are created using curly braces {} to define key-value pairs."
        }
      ]
    },
    'React': {
      'Easy': [
        {
          question: "What is React?",
          options: [
            { text: "A JavaScript library for building user interfaces", isCorrect: true },
            { text: "A database management system", isCorrect: false },
            { text: "A web server", isCorrect: false },
            { text: "A CSS framework", isCorrect: false }
          ],
          explanation: "React is a JavaScript library developed by Facebook for building user interfaces."
        },
        {
          question: "What is JSX?",
          options: [
            { text: "A syntax extension for JavaScript", isCorrect: true },
            { text: "A new programming language", isCorrect: false },
            { text: "A database query language", isCorrect: false },
            { text: "A CSS preprocessor", isCorrect: false }
          ],
          explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript."
        }
      ],
      'Medium': [
        {
          question: "What is a React component?",
          options: [
            { text: "A reusable piece of UI", isCorrect: true },
            { text: "A database table", isCorrect: false },
            { text: "A CSS class", isCorrect: false },
            { text: "A JavaScript variable", isCorrect: false }
          ],
          explanation: "React components are reusable pieces of UI that can be composed to build complex interfaces."
        }
      ]
    },
    'Python': {
      'Easy': [
        {
          question: "What is the correct file extension for Python files?",
          options: [
            { text: ".py", isCorrect: true },
            { text: ".python", isCorrect: false },
            { text: ".pt", isCorrect: false },
            { text: ".pyt", isCorrect: false }
          ],
          explanation: "Python files use the .py extension."
        },
        {
          question: "Which of the following is the correct way to create a variable in Python?",
          options: [
            { text: "x = 5", isCorrect: true },
            { text: "var x = 5", isCorrect: false },
            { text: "int x = 5", isCorrect: false },
            { text: "create x = 5", isCorrect: false }
          ],
          explanation: "In Python, variables are created by simply assigning a value to a name."
        }
      ]
    }
  };

  const topicQuestions = questions[topic] || questions['HTML'];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
  
  return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
}

function generateAptitudeQuestion(topic, difficulty) {
  const questions = {
    'Quantitative': {
      'Easy': [
        {
          question: "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
          options: [
            { text: "150 km", isCorrect: true },
            { text: "120 km", isCorrect: false },
            { text: "180 km", isCorrect: false },
            { text: "200 km", isCorrect: false }
          ],
          explanation: "Distance = Speed × Time = 60 km/h × 2.5 h = 150 km"
        },
        {
          question: "What is 25% of 80?",
          options: [
            { text: "20", isCorrect: true },
            { text: "15", isCorrect: false },
            { text: "25", isCorrect: false },
            { text: "30", isCorrect: false }
          ],
          explanation: "25% of 80 = (25/100) × 80 = 0.25 × 80 = 20"
        },
        {
          question: "If 5 books cost $25, how much do 8 books cost?",
          options: [
            { text: "$40", isCorrect: true },
            { text: "$35", isCorrect: false },
            { text: "$45", isCorrect: false },
            { text: "$50", isCorrect: false }
          ],
          explanation: "Cost per book = $25/5 = $5. So 8 books = 8 × $5 = $40"
        },
        {
          question: "What is 15% of 200?",
          options: [
            { text: "30", isCorrect: true },
            { text: "25", isCorrect: false },
            { text: "35", isCorrect: false },
            { text: "40", isCorrect: false }
          ],
          explanation: "15% of 200 = (15/100) × 200 = 0.15 × 200 = 30"
        },
        {
          question: "A car travels 120 km in 2 hours. What is its speed?",
          options: [
            { text: "60 km/h", isCorrect: true },
            { text: "50 km/h", isCorrect: false },
            { text: "70 km/h", isCorrect: false },
            { text: "80 km/h", isCorrect: false }
          ],
          explanation: "Speed = Distance/Time = 120 km / 2 hours = 60 km/h"
        },
        {
          question: "If x + 5 = 12, what is the value of x?",
          options: [
            { text: "7", isCorrect: true },
            { text: "6", isCorrect: false },
            { text: "8", isCorrect: false },
            { text: "9", isCorrect: false }
          ],
          explanation: "x + 5 = 12, so x = 12 - 5 = 7"
        },
        {
          question: "What is 10% of 150?",
          options: [
            { text: "15", isCorrect: true },
            { text: "10", isCorrect: false },
            { text: "20", isCorrect: false },
            { text: "25", isCorrect: false }
          ],
          explanation: "10% of 150 = (10/100) × 150 = 0.1 × 150 = 15"
        }
      ],
      'Medium': [
        {
          question: "A shopkeeper marks his goods 40% above cost price and gives a discount of 20%. What is his profit percentage?",
          options: [
            { text: "12%", isCorrect: true },
            { text: "20%", isCorrect: false },
            { text: "15%", isCorrect: false },
            { text: "10%", isCorrect: false }
          ],
          explanation: "Marked price = 140% of CP. Selling price = 80% of 140% = 112% of CP. Profit = 12%"
        },
        {
          question: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
          options: [
            { text: "10", isCorrect: true },
            { text: "12", isCorrect: false },
            { text: "8", isCorrect: false },
            { text: "9", isCorrect: false }
          ],
          explanation: "If boys:girls = 3:2 and boys = 15, then girls = (2/3) × 15 = 10"
        }
      ]
    },
    'Logical Reasoning': {
      'Easy': [
        {
          question: "Complete the series: 2, 4, 8, 16, ?",
          options: [
            { text: "32", isCorrect: true },
            { text: "24", isCorrect: false },
            { text: "20", isCorrect: false },
            { text: "28", isCorrect: false }
          ],
          explanation: "Each number is double the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
        },
        {
          question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
          options: [
            { text: "Some roses might be red", isCorrect: true },
            { text: "All roses are red", isCorrect: false },
            { text: "No roses are red", isCorrect: false },
            { text: "All red things are roses", isCorrect: false }
          ],
          explanation: "Since roses are flowers and some flowers are red, it's possible that some roses are red."
        }
      ],
      'Medium': [
        {
          question: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?",
          options: [
            { text: "EOJDJMFN", isCorrect: true },
            { text: "NFEJDJOF", isCorrect: false },
            { text: "MFEJDJOF", isCorrect: false },
            { text: "FOJDJMFN", isCorrect: false }
          ],
          explanation: "Each letter is shifted by +3 positions in the alphabet: M→P, E→H, D→G, etc."
        }
      ]
    },
    'Verbal Ability': {
      'Easy': [
        {
          question: "Choose the synonym of 'Happy':",
          options: [
            { text: "Joyful", isCorrect: true },
            { text: "Sad", isCorrect: false },
            { text: "Angry", isCorrect: false },
            { text: "Tired", isCorrect: false }
          ],
          explanation: "Joyful means feeling or expressing great happiness, making it a synonym of happy."
        },
        {
          question: "Choose the antonym of 'Difficult':",
          options: [
            { text: "Easy", isCorrect: true },
            { text: "Hard", isCorrect: false },
            { text: "Complex", isCorrect: false },
            { text: "Tough", isCorrect: false }
          ],
          explanation: "Easy is the opposite of difficult, meaning not hard to do or understand."
        }
      ]
    },
    'Data Interpretation': {
      'Easy': [
        {
          question: "A pie chart shows: 40% apples, 30% oranges, 20% bananas, 10% grapes. If there are 100 fruits total, how many are apples?",
          options: [
            { text: "40", isCorrect: true },
            { text: "30", isCorrect: false },
            { text: "20", isCorrect: false },
            { text: "10", isCorrect: false }
          ],
          explanation: "40% of 100 fruits = (40/100) × 100 = 40 apples"
        }
      ]
    }
  };

  const topicQuestions = questions[topic] || questions['Quantitative'];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
  
  return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
}

function generateDataScienceQuestion(topic, difficulty) {
  const questions = {
    'Statistics': {
      'Easy': [
        {
          question: "What is the mean of the numbers 2, 4, 6, 8, 10?",
          options: [
            { text: "6", isCorrect: true },
            { text: "5", isCorrect: false },
            { text: "7", isCorrect: false },
            { text: "8", isCorrect: false }
          ],
          explanation: "Mean = (2+4+6+8+10)/5 = 30/5 = 6"
        },
        {
          question: "What is the median of the numbers 1, 3, 5, 7, 9?",
          options: [
            { text: "5", isCorrect: true },
            { text: "4", isCorrect: false },
            { text: "6", isCorrect: false },
            { text: "7", isCorrect: false }
          ],
          explanation: "The median is the middle value when numbers are arranged in order: 1, 3, 5, 7, 9"
        },
        {
          question: "What does 'standard deviation' measure?",
          options: [
            { text: "Spread of data around the mean", isCorrect: true },
            { text: "The highest value in dataset", isCorrect: false },
            { text: "The most frequent value", isCorrect: false },
            { text: "The total sum of values", isCorrect: false }
          ],
          explanation: "Standard deviation measures how spread out data points are from the mean."
        },
        {
          question: "What is the mode in statistics?",
          options: [
            { text: "The most frequently occurring value", isCorrect: true },
            { text: "The middle value", isCorrect: false },
            { text: "The average value", isCorrect: false },
            { text: "The highest value", isCorrect: false }
          ],
          explanation: "The mode is the value that appears most frequently in a dataset."
        },
        {
          question: "What is the range of a dataset?",
          options: [
            { text: "The difference between highest and lowest values", isCorrect: true },
            { text: "The sum of all values", isCorrect: false },
            { text: "The middle value", isCorrect: false },
            { text: "The most common value", isCorrect: false }
          ],
          explanation: "Range = Maximum value - Minimum value in the dataset."
        },
        {
          question: "What is a sample in statistics?",
          options: [
            { text: "A subset of a population", isCorrect: true },
            { text: "The entire population", isCorrect: false },
            { text: "A type of graph", isCorrect: false },
            { text: "A statistical test", isCorrect: false }
          ],
          explanation: "A sample is a subset of individuals from a larger population, used to make inferences about the whole population."
        }
      ],
      'Medium': [
        {
          question: "What is the purpose of cross-validation in machine learning?",
          options: [
            { text: "To assess model performance and prevent overfitting", isCorrect: true },
            { text: "To increase dataset size", isCorrect: false },
            { text: "To clean data", isCorrect: false },
            { text: "To visualize data", isCorrect: false }
          ],
          explanation: "Cross-validation helps evaluate how well a model generalizes to unseen data by testing it on different subsets."
        },
        {
          question: "What is a p-value in statistical testing?",
          options: [
            { text: "Probability of observing results if null hypothesis is true", isCorrect: true },
            { text: "The correlation coefficient", isCorrect: false },
            { text: "The sample size", isCorrect: false },
            { text: "The confidence interval", isCorrect: false }
          ],
          explanation: "A p-value represents the probability of obtaining the observed results assuming the null hypothesis is true."
        }
      ]
    },
    'Machine Learning': {
      'Easy': [
        {
          question: "What is supervised learning?",
          options: [
            { text: "Learning with labeled training data", isCorrect: true },
            { text: "Learning without any data", isCorrect: false },
            { text: "Learning only from images", isCorrect: false },
            { text: "Learning from unlabeled data only", isCorrect: false }
          ],
          explanation: "Supervised learning uses labeled training data to learn patterns and make predictions."
        },
        {
          question: "What is the difference between classification and regression?",
          options: [
            { text: "Classification predicts categories, regression predicts continuous values", isCorrect: true },
            { text: "Classification is harder than regression", isCorrect: false },
            { text: "Regression only works with text data", isCorrect: false },
            { text: "There is no difference", isCorrect: false }
          ],
          explanation: "Classification predicts discrete categories while regression predicts continuous numerical values."
        }
      ],
      'Medium': [
        {
          question: "What is overfitting in machine learning?",
          options: [
            { text: "When a model performs well on training data but poorly on new data", isCorrect: true },
            { text: "When a model is too simple", isCorrect: false },
            { text: "When training takes too long", isCorrect: false },
            { text: "When the dataset is too small", isCorrect: false }
          ],
          explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize."
        }
      ]
    },
    'Python': {
      'Easy': [
        {
          question: "Which library is commonly used for data manipulation in Python?",
          options: [
            { text: "pandas", isCorrect: true },
            { text: "requests", isCorrect: false },
            { text: "flask", isCorrect: false },
            { text: "pygame", isCorrect: false }
          ],
          explanation: "Pandas is the most popular Python library for data manipulation and analysis."
        },
        {
          question: "What does 'import numpy as np' do?",
          options: [
            { text: "Imports NumPy library with alias 'np'", isCorrect: true },
            { text: "Creates a new variable called np", isCorrect: false },
            { text: "Installs NumPy package", isCorrect: false },
            { text: "Deletes NumPy from system", isCorrect: false }
          ],
          explanation: "This imports the NumPy library and gives it the alias 'np' for easier reference."
        }
      ]
    }
  };

  const topicQuestions = questions[topic] || questions['Statistics'];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
  
  return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
}

function generateHealthcareQuestion(topic, difficulty) {
  const questions = {
    'Anatomy': {
      'Easy': [
        {
          question: "What is the normal resting heart rate for adults?",
          options: [
            { text: "60-100 beats per minute", isCorrect: true },
            { text: "40-60 beats per minute", isCorrect: false },
            { text: "100-120 beats per minute", isCorrect: false },
            { text: "120-140 beats per minute", isCorrect: false }
          ],
          explanation: "The normal resting heart rate for adults ranges from 60 to 100 beats per minute."
        },
        {
          question: "How many chambers does the human heart have?",
          options: [
            { text: "4", isCorrect: true },
            { text: "2", isCorrect: false },
            { text: "3", isCorrect: false },
            { text: "6", isCorrect: false }
          ],
          explanation: "The human heart has four chambers: two atria and two ventricles."
        },
        {
          question: "What is the largest organ in the human body?",
          options: [
            { text: "Skin", isCorrect: true },
            { text: "Liver", isCorrect: false },
            { text: "Brain", isCorrect: false },
            { text: "Lungs", isCorrect: false }
          ],
          explanation: "The skin is the largest organ in the human body, covering the entire external surface."
        },
        {
          question: "Which blood type is known as the universal donor?",
          options: [
            { text: "O negative", isCorrect: true },
            { text: "A positive", isCorrect: false },
            { text: "B negative", isCorrect: false },
            { text: "AB positive", isCorrect: false }
          ],
          explanation: "O negative blood can be given to people with any blood type, making it the universal donor."
        },
        {
          question: "What is the main function of red blood cells?",
          options: [
            { text: "Carry oxygen throughout the body", isCorrect: true },
            { text: "Fight infections", isCorrect: false },
            { text: "Help blood clot", isCorrect: false },
            { text: "Produce hormones", isCorrect: false }
          ],
          explanation: "Red blood cells contain hemoglobin, which carries oxygen from the lungs to body tissues."
        },
        {
          question: "How many bones are in the adult human body?",
          options: [
            { text: "206", isCorrect: true },
            { text: "195", isCorrect: false },
            { text: "220", isCorrect: false },
            { text: "180", isCorrect: false }
          ],
          explanation: "The adult human skeleton has 206 bones, though babies are born with about 270 bones."
        },
        {
          question: "What is the normal body temperature for humans?",
          options: [
            { text: "98.6°F (37°C)", isCorrect: true },
            { text: "100°F (38°C)", isCorrect: false },
            { text: "96°F (35°C)", isCorrect: false },
            { text: "102°F (39°C)", isCorrect: false }
          ],
          explanation: "Normal human body temperature is approximately 98.6°F or 37°C."
        }
      ],
      'Medium': [
        {
          question: "Which part of the brain controls balance and coordination?",
          options: [
            { text: "Cerebellum", isCorrect: true },
            { text: "Cerebrum", isCorrect: false },
            { text: "Medulla", isCorrect: false },
            { text: "Hypothalamus", isCorrect: false }
          ],
          explanation: "The cerebellum is responsible for balance, coordination, and fine motor control."
        }
      ]
    },
    'Pharmacology': {
      'Easy': [
        {
          question: "What does 'mg' stand for in medication dosing?",
          options: [
            { text: "Milligrams", isCorrect: true },
            { text: "Micrograms", isCorrect: false },
            { text: "Megagrams", isCorrect: false },
            { text: "Milligallons", isCorrect: false }
          ],
          explanation: "mg stands for milligrams, a unit of mass equal to one thousandth of a gram."
        },
        {
          question: "What is the study of how drugs affect the body called?",
          options: [
            { text: "Pharmacodynamics", isCorrect: true },
            { text: "Pharmacokinetics", isCorrect: false },
            { text: "Pharmacy", isCorrect: false },
            { text: "Physiology", isCorrect: false }
          ],
          explanation: "Pharmacodynamics is the study of how drugs affect the body and their mechanisms of action."
        }
      ]
    },
    'Medical Ethics': {
      'Easy': [
        {
          question: "What does patient confidentiality mean?",
          options: [
            { text: "Keeping patient information private", isCorrect: true },
            { text: "Sharing patient information with everyone", isCorrect: false },
            { text: "Only treating confident patients", isCorrect: false },
            { text: "Avoiding difficult patients", isCorrect: false }
          ],
          explanation: "Patient confidentiality means protecting and keeping private all patient health information."
        }
      ]
    },
    'Patient Care': {
      'Easy': [
        {
          question: "What is the first step in patient assessment?",
          options: [
            { text: "Taking vital signs", isCorrect: true },
            { text: "Prescribing medication", isCorrect: false },
            { text: "Ordering tests", isCorrect: false },
            { text: "Discharging the patient", isCorrect: false }
          ],
          explanation: "Taking vital signs (temperature, pulse, blood pressure, respiration) is typically the first step in patient assessment."
        },
        {
          question: "What does 'informed consent' mean?",
          options: [
            { text: "Patient understands and agrees to treatment", isCorrect: true },
            { text: "Doctor decides treatment without asking", isCorrect: false },
            { text: "Family makes all decisions", isCorrect: false },
            { text: "Treatment is given in emergency only", isCorrect: false }
          ],
          explanation: "Informed consent means the patient understands the treatment, risks, and benefits, and agrees to proceed."
        }
      ]
    }
  };

  const topicQuestions = questions[topic] || questions['Anatomy'];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
  
  return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
}

function generateFinanceQuestion(topic, difficulty) {
  const questions = {
    'Financial Analysis': {
      'Easy': [
        {
          question: "What does ROI stand for in finance?",
          options: [
            { text: "Return on Investment", isCorrect: true },
            { text: "Rate of Interest", isCorrect: false },
            { text: "Risk of Investment", isCorrect: false },
            { text: "Revenue over Income", isCorrect: false }
          ],
          explanation: "ROI stands for Return on Investment, which measures the efficiency of an investment."
        },
        {
          question: "What is a budget?",
          options: [
            { text: "A plan for spending and saving money", isCorrect: true },
            { text: "A type of bank account", isCorrect: false },
            { text: "A financial penalty", isCorrect: false },
            { text: "A loan application", isCorrect: false }
          ],
          explanation: "A budget is a financial plan that outlines expected income and expenses over a specific period."
        },
        {
          question: "What is compound interest?",
          options: [
            { text: "Interest earned on both principal and previously earned interest", isCorrect: true },
            { text: "Interest paid only on the principal", isCorrect: false },
            { text: "Interest that decreases over time", isCorrect: false },
            { text: "Interest paid monthly", isCorrect: false }
          ],
          explanation: "Compound interest is interest calculated on both the initial principal and accumulated interest from previous periods."
        },
        {
          question: "What is a credit score?",
          options: [
            { text: "A number representing creditworthiness", isCorrect: true },
            { text: "The amount of money in your account", isCorrect: false },
            { text: "Your monthly income", isCorrect: false },
            { text: "The interest rate on loans", isCorrect: false }
          ],
          explanation: "A credit score is a numerical representation of your creditworthiness based on credit history."
        },
        {
          question: "What is cash flow?",
          options: [
            { text: "The movement of money in and out of a business", isCorrect: true },
            { text: "The total amount of cash in a bank", isCorrect: false },
            { text: "The speed of financial transactions", isCorrect: false },
            { text: "The interest earned on savings", isCorrect: false }
          ],
          explanation: "Cash flow refers to the movement of money into and out of a business or personal finances."
        },
        {
          question: "What is equity?",
          options: [
            { text: "Ownership value in an asset after debts", isCorrect: true },
            { text: "A type of loan", isCorrect: false },
            { text: "Monthly expenses", isCorrect: false },
            { text: "Tax payments", isCorrect: false }
          ],
          explanation: "Equity represents the ownership value in an asset after subtracting any debts or liabilities."
        }
      ],
      'Medium': [
        {
          question: "What is the difference between assets and liabilities?",
          options: [
            { text: "Assets are what you own, liabilities are what you owe", isCorrect: true },
            { text: "Assets are debts, liabilities are income", isCorrect: false },
            { text: "Assets are expenses, liabilities are savings", isCorrect: false },
            { text: "There is no difference", isCorrect: false }
          ],
          explanation: "Assets are resources you own that have value, while liabilities are debts or obligations you owe."
        }
      ]
    },
    'Investment': {
      'Easy': [
        {
          question: "What is a stock?",
          options: [
            { text: "A share of ownership in a company", isCorrect: true },
            { text: "A type of loan", isCorrect: false },
            { text: "A savings account", isCorrect: false },
            { text: "A credit card", isCorrect: false }
          ],
          explanation: "A stock represents a share of ownership in a company, giving the holder a claim on assets and earnings."
        },
        {
          question: "What does diversification mean in investing?",
          options: [
            { text: "Spreading investments across different assets", isCorrect: true },
            { text: "Investing all money in one stock", isCorrect: false },
            { text: "Only investing in bonds", isCorrect: false },
            { text: "Avoiding all investments", isCorrect: false }
          ],
          explanation: "Diversification means spreading investments across various assets to reduce risk."
        }
      ]
    },
    'Risk Management': {
      'Easy': [
        {
          question: "What is insurance?",
          options: [
            { text: "Protection against financial loss", isCorrect: true },
            { text: "A type of investment", isCorrect: false },
            { text: "A savings plan", isCorrect: false },
            { text: "A loan product", isCorrect: false }
          ],
          explanation: "Insurance provides financial protection against potential losses or damages."
        }
      ]
    },
    'Accounting': {
      'Easy': [
        {
          question: "What is the accounting equation?",
          options: [
            { text: "Assets = Liabilities + Equity", isCorrect: true },
            { text: "Income = Expenses + Profit", isCorrect: false },
            { text: "Revenue = Costs + Margin", isCorrect: false },
            { text: "Cash = Debits - Credits", isCorrect: false }
          ],
          explanation: "The fundamental accounting equation is Assets = Liabilities + Equity, which must always balance."
        },
        {
          question: "What is depreciation?",
          options: [
            { text: "The decrease in value of an asset over time", isCorrect: true },
            { text: "An increase in asset value", isCorrect: false },
            { text: "A type of tax", isCorrect: false },
            { text: "A loan payment", isCorrect: false }
          ],
          explanation: "Depreciation is the allocation of an asset's cost over its useful life as it loses value."
        }
      ]
    }
  };

  const topicQuestions = questions[topic] || questions['Financial Analysis'];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
  
  return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
}

function generateInterviewQuestion(topic, difficulty) {
  const questions = {
    'Behavioral Questions': {
      'Easy': [
        {
          question: "Tell me about yourself.",
          options: [
            { text: "Focus on professional background, key achievements, and career goals", isCorrect: true },
            { text: "Share personal life details and hobbies", isCorrect: false },
            { text: "List all previous job titles chronologically", isCorrect: false },
            { text: "Discuss salary expectations and benefits", isCorrect: false }
          ],
          explanation: "A good self-introduction should focus on professional background, key achievements, and how they align with the role."
        },
        {
          question: "Why do you want to work here?",
          options: [
            { text: "Research the company and connect your goals with their mission", isCorrect: true },
            { text: "Say you need a job and any company will do", isCorrect: false },
            { text: "Focus only on salary and benefits", isCorrect: false },
            { text: "Mention that it's close to your home", isCorrect: false }
          ],
          explanation: "Show genuine interest by researching the company and explaining how your goals align with their mission and values."
        },
        {
          question: "What is your greatest strength?",
          options: [
            { text: "Choose a strength relevant to the job with specific examples", isCorrect: true },
            { text: "Say you don't have any weaknesses", isCorrect: false },
            { text: "List multiple strengths without examples", isCorrect: false },
            { text: "Mention a strength unrelated to work", isCorrect: false }
          ],
          explanation: "Choose a strength that's relevant to the position and support it with specific examples from your experience."
        },
        {
          question: "Describe a challenging situation you faced at work.",
          options: [
            { text: "Use the STAR method (Situation, Task, Action, Result)", isCorrect: true },
            { text: "Blame others for the problem", isCorrect: false },
            { text: "Say you never faced any challenges", isCorrect: false },
            { text: "Focus only on the problem without mentioning solutions", isCorrect: false }
          ],
          explanation: "Use the STAR method to structure your response: describe the Situation, Task, Action you took, and Result achieved."
        }
      ],
      'Medium': [
        {
          question: "How do you handle conflict with a coworker?",
          options: [
            { text: "Address the issue directly and professionally, seeking common ground", isCorrect: true },
            { text: "Avoid the person and hope the problem resolves itself", isCorrect: false },
            { text: "Complain to other colleagues about the person", isCorrect: false },
            { text: "Immediately escalate to management", isCorrect: false }
          ],
          explanation: "The best approach is to address conflicts directly and professionally, focusing on finding solutions and common ground."
        },
        {
          question: "Describe a time when you had to learn something new quickly.",
          options: [
            { text: "Explain your learning strategy and how you applied the knowledge", isCorrect: true },
            { text: "Say you're naturally good at everything", isCorrect: false },
            { text: "Admit you struggled and couldn't learn it", isCorrect: false },
            { text: "Focus only on how difficult it was", isCorrect: false }
          ],
          explanation: "Demonstrate your learning agility by explaining your approach to learning and how you successfully applied new knowledge."
        }
      ]
    },
    'Technical Questions': {
      'Easy': [
        {
          question: "How would you explain a complex technical concept to a non-technical person?",
          options: [
            { text: "Use analogies and simple language, avoid jargon", isCorrect: true },
            { text: "Use all the technical terms to show expertise", isCorrect: false },
            { text: "Tell them it's too complicated to understand", isCorrect: false },
            { text: "Draw complex diagrams with technical details", isCorrect: false }
          ],
          explanation: "The key is to use analogies, simple language, and avoid jargon while ensuring the core concept is understood."
        },
        {
          question: "What steps do you take when debugging a problem?",
          options: [
            { text: "Systematic approach: reproduce, isolate, analyze, test, document", isCorrect: true },
            { text: "Keep trying random solutions until something works", isCorrect: false },
            { text: "Immediately ask someone else to fix it", isCorrect: false },
            { text: "Restart everything and hope it works", isCorrect: false }
          ],
          explanation: "A systematic debugging approach involves reproducing the issue, isolating variables, analyzing root causes, testing solutions, and documenting the fix."
        }
      ],
      'Medium': [
        {
          question: "How do you stay updated with new technologies in your field?",
          options: [
            { text: "Multiple sources: blogs, courses, conferences, practice projects", isCorrect: true },
            { text: "Only rely on what you learned in school", isCorrect: false },
            { text: "Wait for your company to provide training", isCorrect: false },
            { text: "Learn only when forced to for a project", isCorrect: false }
          ],
          explanation: "Continuous learning through various sources like blogs, online courses, conferences, and hands-on practice shows commitment to professional growth."
        }
      ]
    },
    'Communication Skills': {
      'Easy': [
        {
          question: "How do you handle giving feedback to a team member?",
          options: [
            { text: "Be specific, constructive, and focus on behavior, not personality", isCorrect: true },
            { text: "Give feedback publicly to set an example", isCorrect: false },
            { text: "Only mention what they did wrong", isCorrect: false },
            { text: "Avoid giving feedback to maintain relationships", isCorrect: false }
          ],
          explanation: "Effective feedback should be specific, constructive, private, and focus on behaviors and actions rather than personality traits."
        },
        {
          question: "How do you ensure clear communication in emails?",
          options: [
            { text: "Clear subject line, structured content, specific action items", isCorrect: true },
            { text: "Write long detailed emails covering everything", isCorrect: false },
            { text: "Use lots of technical jargon to sound professional", isCorrect: false },
            { text: "Keep emails as short as possible with minimal details", isCorrect: false }
          ],
          explanation: "Clear email communication requires a descriptive subject line, well-structured content, and specific action items with deadlines."
        }
      ]
    },
    'Problem Solving': {
      'Easy': [
        {
          question: "Walk me through your problem-solving process.",
          options: [
            { text: "Define problem, gather information, generate solutions, evaluate, implement", isCorrect: true },
            { text: "Jump to the first solution that comes to mind", isCorrect: false },
            { text: "Ask others to solve it for you", isCorrect: false },
            { text: "Try different approaches randomly", isCorrect: false }
          ],
          explanation: "A structured problem-solving approach involves defining the problem, gathering information, generating multiple solutions, evaluating options, and implementing the best solution."
        },
        {
          question: "How do you prioritize tasks when everything seems urgent?",
          options: [
            { text: "Assess impact and urgency, communicate with stakeholders, create a plan", isCorrect: true },
            { text: "Work on whatever is loudest or most recent", isCorrect: false },
            { text: "Do everything at once", isCorrect: false },
            { text: "Let others decide what you should work on", isCorrect: false }
          ],
          explanation: "Effective prioritization involves assessing both impact and urgency, communicating with stakeholders, and creating a clear action plan."
        }
      ]
    }
  };

  const topicQuestions = questions[topic] || questions['Behavioral Questions'];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
  
  return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
}

function generateGenericQuestion(topic, difficulty) {
  return {
    question: `What is the most important concept in ${topic}?`,
    options: [
      { text: `Understanding ${topic} fundamentals`, isCorrect: true },
      { text: `Memorizing ${topic} syntax`, isCorrect: false },
      { text: `Avoiding ${topic} completely`, isCorrect: false },
      { text: `Using ${topic} without learning`, isCorrect: false }
    ],
    explanation: `Understanding the fundamentals of ${topic} is crucial for building a strong foundation.`
  };
}

function getEstimatedTime(difficulty) {
  const timeMap = {
    'Easy': 30,
    'Medium': 60,
    'Hard': 90,
    'Expert': 120
  };
  return timeMap[difficulty] || 60;
}

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ CareerPath Tracker Server with AI Quiz Engine running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 Backend: http://localhost:${PORT}`);
  console.log(`👤 Demo login: demo@careerpath.com / demo123`);
  console.log(`📚 Features: ${domains.length} domains, ${courses.length} courses, AI Quiz Engine`);
  console.log(`🧠 AI Quiz Engine: Generate adaptive quizzes for all domains`);
  console.log(`🎯 Quiz Features: Level-based progression, 70% pass threshold, detailed feedback`);
});