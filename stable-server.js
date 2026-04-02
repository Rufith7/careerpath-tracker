const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

// Import in-memory data
const { 
  users, 
  courses, 
  domains, 
  aptitudeResources, 
  interviewResources 
} = require('./simple-auth');

const app = express();
const PORT = 5001;
const JWT_SECRET = 'your_jwt_secret_key_here';

// In-memory quiz storage
let quizQuestions = [];
let quizAttempts = [];

// Middleware with error handling
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

// Global error handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit - keep server running
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    uptime: process.uptime()
  });
});

// Auth middleware
const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
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

// Register endpoint with comprehensive error handling
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Registration attempt:', { name, email, passwordLength: password?.length });

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists (case insensitive)
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed successfully');

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
      ],
      createdAt: new Date()
    };

    users.push(newUser);
    console.log('✅ New user created:', { id: newUser.id, email: newUser.email });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    const response = {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        selectedDomain: newUser.selectedDomain,
        progress: newUser.progress
      }
    };

    console.log('✅ Registration successful, sending response');
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists (case insensitive email)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', { id: user.id, email: user.email });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login successful for user:', user.email);

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
    console.error('❌ Login error:', error.message);
    console.error('Stack:', error.stack);
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
    console.error('❌ Get user error:', error.message);
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
    console.error('❌ Profile update error:', error.message);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Get domains
app.get('/api/domains', auth, (req, res) => {
  try {
    res.json(domains);
  } catch (error) {
    console.error('❌ Get domains error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses
app.get('/api/courses', auth, (req, res) => {
  try {
    res.json(courses);
  } catch (error) {
    console.error('❌ Get courses error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get aptitude resources
app.get('/api/aptitude', auth, (req, res) => {
  try {
    res.json(aptitudeResources);
  } catch (error) {
    console.error('❌ Get aptitude resources error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get interview resources
app.get('/api/interview', auth, (req, res) => {
  try {
    res.json(interviewResources);
  } catch (error) {
    console.error('❌ Get interview resources error:', error.message);
    res.status(500).json({ message: 'Server error' });
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
    console.error('❌ Get progress error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Quiz topics endpoint
app.get('/api/quiz/topics/:domain', auth, (req, res) => {
  try {
    const { domain } = req.params;
    
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
    console.error('❌ Topics fetch error:', error.message);
    res.status(500).json({ 
      message: 'Error fetching topics',
      error: error.message 
    });
  }
});

// Generate simple quiz (no AI dependencies)
app.post('/api/quiz/generate', auth, async (req, res) => {
  try {
    const { domain, topic, level, difficulty = 'Medium', questionCount = 10 } = req.body;

    if (!domain || !topic || !level) {
      return res.status(400).json({ 
        message: 'Domain, topic, and level are required' 
      });
    }

    // Real quiz questions by domain and topic
    const quizDatabase = {
      IT: {
        JavaScript: [
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'int x = 5;'],
            correctIndex: 0
          },
          {
            question: 'Which method is used to add an element at the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctIndex: 0
          },
          {
            question: 'What does "===" operator do in JavaScript?',
            options: ['Assigns value', 'Compares value and type', 'Compares only value', 'None of the above'],
            correctIndex: 1
          },
          {
            question: 'Which keyword is used to define a constant in JavaScript?',
            options: ['var', 'let', 'const', 'constant'],
            correctIndex: 2
          },
          {
            question: 'What is the output of: typeof null?',
            options: ['null', 'undefined', 'object', 'number'],
            correctIndex: 2
          },
          {
            question: 'Which method converts JSON string to JavaScript object?',
            options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.object()'],
            correctIndex: 0
          },
          {
            question: 'What is a closure in JavaScript?',
            options: ['A loop structure', 'A function with access to outer scope', 'A data type', 'An operator'],
            correctIndex: 1
          },
          {
            question: 'Which symbol is used for single-line comments?',
            options: ['#', '//', '/*', '--'],
            correctIndex: 1
          },
          {
            question: 'What does the "this" keyword refer to?',
            options: ['Current function', 'Current object', 'Global object', 'Previous object'],
            correctIndex: 1
          },
          {
            question: 'Which method is used to remove the last element from an array?',
            options: ['pop()', 'push()', 'shift()', 'splice()'],
            correctIndex: 0
          }
        ],
        React: [
          {
            question: 'What is React?',
            options: ['A JavaScript library', 'A programming language', 'A database', 'An operating system'],
            correctIndex: 0
          },
          {
            question: 'What is JSX?',
            options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extension', 'JavaScript Extra'],
            correctIndex: 0
          },
          {
            question: 'Which hook is used for side effects?',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctIndex: 1
          },
          {
            question: 'What is the virtual DOM?',
            options: ['Real DOM copy', 'Lightweight DOM representation', 'Browser DOM', 'Server DOM'],
            correctIndex: 1
          },
          {
            question: 'How do you create a component in React?',
            options: ['function Component()', 'class Component', 'Both A and B', 'None'],
            correctIndex: 2
          },
          {
            question: 'What is props in React?',
            options: ['Properties passed to components', 'State management', 'Styling method', 'Routing'],
            correctIndex: 0
          },
          {
            question: 'Which method is used to update state?',
            options: ['setState()', 'updateState()', 'changeState()', 'modifyState()'],
            correctIndex: 0
          },
          {
            question: 'What is the purpose of keys in React lists?',
            options: ['Styling', 'Identify elements uniquely', 'Add security', 'Improve speed'],
            correctIndex: 1
          },
          {
            question: 'What is React Router used for?',
            options: ['State management', 'Navigation', 'Styling', 'API calls'],
            correctIndex: 1
          },
          {
            question: 'What is the default port for React development server?',
            options: ['3000', '8080', '5000', '4200'],
            correctIndex: 0
          }
        ]
      },
      DataScience: {
        Python: [
          {
            question: 'What is the correct file extension for Python files?',
            options: ['.py', '.python', '.pt', '.pyt'],
            correctIndex: 0
          },
          {
            question: 'Which keyword is used to create a function in Python?',
            options: ['function', 'def', 'func', 'define'],
            correctIndex: 1
          },
          {
            question: 'What is the output of: print(type([]))?',
            options: ['<class "array">', '<class "list">', '<class "tuple">', '<class "dict">'],
            correctIndex: 1
          },
          {
            question: 'Which operator is used for exponentiation in Python?',
            options: ['^', '**', 'exp', 'pow'],
            correctIndex: 1
          },
          {
            question: 'What is a correct syntax to output "Hello World"?',
            options: ['echo("Hello World")', 'print("Hello World")', 'printf("Hello World")', 'cout << "Hello World"'],
            correctIndex: 1
          },
          {
            question: 'Which collection is ordered and changeable?',
            options: ['Tuple', 'Set', 'List', 'Dictionary'],
            correctIndex: 2
          },
          {
            question: 'What is the correct way to create a dictionary?',
            options: ['dict = {}', 'dict = []', 'dict = ()', 'dict = <>'],
            correctIndex: 0
          },
          {
            question: 'Which method is used to add an element to a list?',
            options: ['add()', 'append()', 'insert()', 'push()'],
            correctIndex: 1
          },
          {
            question: 'What is the output of: len("Python")?',
            options: ['5', '6', '7', 'Error'],
            correctIndex: 1
          },
          {
            question: 'Which keyword is used for exception handling?',
            options: ['try', 'catch', 'except', 'Both A and C'],
            correctIndex: 3
          }
        ]
      }
    };

    // Get questions for the domain and topic, or use generic ones
    let questionPool = [];
    if (quizDatabase[domain] && quizDatabase[domain][topic]) {
      questionPool = quizDatabase[domain][topic];
    } else {
      // Generic fallback questions
      questionPool = [
        {
          question: `What is the fundamental concept of ${topic}?`,
          options: ['Basic understanding', 'Advanced techniques', 'Core principles', 'All of the above'],
          correctIndex: 3
        },
        {
          question: `Which skill is most important for ${topic}?`,
          options: ['Problem solving', 'Memorization', 'Speed', 'Luck'],
          correctIndex: 0
        },
        {
          question: `What is the best way to learn ${topic}?`,
          options: ['Practice regularly', 'Read once', 'Watch videos only', 'Skip basics'],
          correctIndex: 0
        },
        {
          question: `${topic} is primarily used in which field?`,
          options: [domain, 'All fields', 'None', 'Unknown'],
          correctIndex: 0
        },
        {
          question: `What level of difficulty is ${topic} considered?`,
          options: ['Beginner', 'Intermediate', 'Advanced', 'Depends on background'],
          correctIndex: 3
        },
        {
          question: `How long does it typically take to master ${topic}?`,
          options: ['1 week', '1 month', '3-6 months', '1+ years'],
          correctIndex: 2
        },
        {
          question: `What is a common mistake when learning ${topic}?`,
          options: ['Skipping fundamentals', 'Practicing too much', 'Reading documentation', 'Asking questions'],
          correctIndex: 0
        },
        {
          question: `Which resource is best for learning ${topic}?`,
          options: ['Official documentation', 'Random blogs', 'Social media', 'Guessing'],
          correctIndex: 0
        },
        {
          question: `What should you do after learning ${topic} basics?`,
          options: ['Stop learning', 'Build projects', 'Forget it', 'Start over'],
          correctIndex: 1
        },
        {
          question: `Why is ${topic} important in ${domain}?`,
          options: ['It\'s not important', 'Core skill required', 'Optional knowledge', 'Outdated concept'],
          correctIndex: 1
        }
      ];
    }

    // Shuffle and select questions
    const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    // Generate questions with proper structure
    const questions = [];
    for (let i = 0; i < selectedQuestions.length; i++) {
      const q = selectedQuestions[i];
      const questionId = `${domain}_${topic}_${level}_${Date.now()}_${i}`;
      
      const question = {
        _id: questionId,
        domain,
        topic,
        level,
        difficulty,
        question: q.question,
        options: q.options.map((text, index) => ({
          text: text,
          isCorrect: index === q.correctIndex
        })),
        explanation: `The correct answer is: ${q.options[q.correctIndex]}`,
        estimatedTime: 60
      };
      
      questions.push(question);
      quizQuestions.push(question);
    }

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
    console.error('❌ Quiz generation error:', error.message);
    res.status(500).json({ 
      message: 'Error generating quiz',
      error: error.message 
    });
  }
});

// Submit quiz
app.post('/api/quiz/submit', auth, async (req, res) => {
  try {
    const { domain, topic, level, answers, timeSpent, difficulty = 'Medium' } = req.body;

    if (!domain || !topic || !level || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        message: 'Invalid quiz submission data' 
      });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = quizQuestions.filter(q => questionIds.includes(q._id));

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
    const passed = score >= 70;

    // Update user progress if passed (70% or higher)
    if (passed && score >= 70) {
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
    }

    res.json({
      success: true,
      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions: answers.length,
        timeSpent: timeSpent || 0,
        nextLevelUnlocked: passed && score >= 70,
        detailedAnswers
      }
    });
  } catch (error) {
    console.error('❌ Quiz submission error:', error.message);
    res.status(500).json({ 
      message: 'Error submitting quiz',
      error: error.message 
    });
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log('✅ Stable CareerPath Server running on port', PORT);
  console.log('📱 Frontend: http://localhost:3000');
  console.log('🔧 Backend: http://localhost:5001');
  console.log('👤 Demo login: demo@careerpath.com / demo123');
  console.log('🛡️  Enhanced error handling enabled');
  console.log('♻️  Auto-recovery enabled');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
