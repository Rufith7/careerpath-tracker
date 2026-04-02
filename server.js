const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'careerpath_secret_2024';

// ─── In-Memory Data ───────────────────────────────────────────────────────────
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@careerpath.com',
    // bcrypt hash of "demo123"
    password: '$2a$10$L0yBU4IouDRKQH5296jO1uq4F2DdH7Nh15yHfFdSE9aamnIHBjtCy',
    selectedDomain: 'IT',
    progress: {
      IT:          { currentLevel: 1, unlockedLevels: [1] },
      DataScience: { currentLevel: 1, unlockedLevels: [1] },
      Healthcare:  { currentLevel: 1, unlockedLevels: [1] },
      Finance:     { currentLevel: 1, unlockedLevels: [1] },
      Aptitude:    { currentLevel: 1, unlockedLevels: [1] },
      Interview:   { currentLevel: 1, unlockedLevels: [1] }
    }
  }
];

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', port: PORT });
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists)
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(Date.now()),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      selectedDomain: null,
      progress: {
        IT:          { currentLevel: 1, unlockedLevels: [1] },
        DataScience: { currentLevel: 1, unlockedLevels: [1] },
        Healthcare:  { currentLevel: 1, unlockedLevels: [1] },
        Finance:     { currentLevel: 1, unlockedLevels: [1] },
        Aptitude:    { currentLevel: 1, unlockedLevels: [1] },
        Interview:   { currentLevel: 1, unlockedLevels: [1] }
      }
    };
    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ME
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// UPDATE PROFILE
app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const idx = users.findIndex(u => u.id === req.userId);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  if (req.body.selectedDomain) users[idx].selectedDomain = req.body.selectedDomain;
  const { password: _, ...safeUser } = users[idx];
  res.json(safeUser);
});

// QUIZ TOPICS - no auth required
app.get('/api/quiz/topics/:domain', (req, res) => {
  const topicMap = {
    IT:          ['JavaScript', 'React', 'HTML & CSS', 'Node.js', 'Python', 'Databases'],
    DataScience: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL'],
    Healthcare:  ['Anatomy', 'Pharmacology', 'Medical Ethics', 'Patient Care', 'Nutrition'],
    Finance:     ['Accounting', 'Investment', 'Risk Management', 'Financial Analysis', 'Economics'],
    Aptitude:    ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
    Interview:   ['Behavioral Questions', 'Technical Questions', 'Communication', 'Problem Solving']
  };
  res.json({ success: true, topics: topicMap[req.params.domain] || ['General'] });
});

// QUIZ GENERATE - no auth required
app.post('/api/quiz/generate', (req, res) => {
  const { domain, topic, level, questionCount = 10 } = req.body;
  if (!domain || !topic || !level)
    return res.status(400).json({ message: 'domain, topic, and level are required' });

  const bank = {
    JavaScript: [
      { q: 'Which keyword declares a block-scoped variable?', opts: ['var', 'let', 'function', 'static'], ans: 1 },
      { q: 'What does === check?', opts: ['Value only', 'Type only', 'Value and type', 'Reference'], ans: 2 },
      { q: 'What is the output of typeof null?', opts: ['null', 'undefined', 'object', 'number'], ans: 2 },
      { q: 'Which method adds an element to the end of an array?', opts: ['push()', 'pop()', 'shift()', 'unshift()'], ans: 0 },
      { q: 'What does JSON.parse() do?', opts: ['Converts object to string', 'Converts string to object', 'Deletes JSON', 'Creates JSON file'], ans: 1 },
      { q: 'Which is NOT a JavaScript data type?', opts: ['String', 'Boolean', 'Float', 'Symbol'], ans: 2 },
      { q: 'What does the spread operator (...) do?', opts: ['Deletes array', 'Expands iterable', 'Creates loop', 'Declares variable'], ans: 1 },
      { q: 'What is a closure?', opts: ['A loop', 'Function accessing outer scope', 'An error', 'A data type'], ans: 1 },
      { q: 'Which method converts array to string?', opts: ['toString()', 'join()', 'Both A and B', 'stringify()'], ans: 2 },
      { q: 'What is Promise used for?', opts: ['Styling', 'Async operations', 'Routing', 'Storage'], ans: 1 }
    ],
    React: [
      { q: 'What is JSX?', opts: ['JavaScript XML', 'Java Syntax', 'JSON Extension', 'JS Extra'], ans: 0 },
      { q: 'Which hook manages state?', opts: ['useEffect', 'useState', 'useContext', 'useRef'], ans: 1 },
      { q: 'What is the virtual DOM?', opts: ['Real DOM', 'Lightweight DOM copy', 'Server DOM', 'CSS DOM'], ans: 1 },
      { q: 'Which hook handles side effects?', opts: ['useState', 'useCallback', 'useEffect', 'useMemo'], ans: 2 },
      { q: 'What are props?', opts: ['State variables', 'Data passed to components', 'CSS styles', 'Event handlers'], ans: 1 },
      { q: 'What does key prop do in lists?', opts: ['Styling', 'Uniquely identifies elements', 'Adds security', 'Speeds up CSS'], ans: 1 },
      { q: 'What is React.memo used for?', opts: ['Memoize components', 'Create state', 'Handle events', 'Fetch data'], ans: 0 },
      { q: 'Default React dev server port?', opts: ['8080', '3000', '5000', '4200'], ans: 1 },
      { q: 'What is context API for?', opts: ['Routing', 'Global state sharing', 'Styling', 'Testing'], ans: 1 },
      { q: 'How to prevent re-render?', opts: ['useEffect', 'useState', 'React.memo', 'useRef'], ans: 2 }
    ],
    Python: [
      { q: 'Python file extension?', opts: ['.py', '.python', '.pt', '.pyt'], ans: 0 },
      { q: 'Keyword to define a function?', opts: ['function', 'def', 'func', 'define'], ans: 1 },
      { q: 'Output of type([])?', opts: ['array', 'list', 'tuple', 'dict'], ans: 1 },
      { q: 'Exponentiation operator?', opts: ['^', '**', 'exp()', 'pow'], ans: 1 },
      { q: 'Which is mutable?', opts: ['Tuple', 'String', 'List', 'Frozenset'], ans: 2 },
      { q: 'How to create a dictionary?', opts: ['{}', '[]', '()', '<>'], ans: 0 },
      { q: 'Add element to list?', opts: ['add()', 'append()', 'insert()', 'push()'], ans: 1 },
      { q: 'len("Python") = ?', opts: ['5', '6', '7', 'Error'], ans: 1 },
      { q: 'Exception handling keyword?', opts: ['try/catch', 'try/except', 'catch', 'handle'], ans: 1 },
      { q: 'Import a module?', opts: ['include', 'require', 'import', 'use'], ans: 2 }
    ]
  };

  const pool = bank[topic] || bank['JavaScript'];
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, pool.length));
  const ts = Date.now();

  const questions = shuffled.map((item, i) => ({
    _id: `${domain}_${topic}_${level}_${ts}_${i}`,
    question: item.q,
    options: item.opts.map((text, idx) => ({ text, isCorrect: idx === item.ans })),
    correctIndex: item.ans,
    explanation: `Correct answer: ${item.opts[item.ans]}`
  }));

  res.json({
    success: true,
    quiz: {
      domain, topic, level,
      totalQuestions: questions.length,
      questions: questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options.map((o, i) => ({ text: o.text, index: i })),
        explanation: q.explanation
      }))
    }
  });
});

// QUIZ SUBMIT - no auth required
app.post('/api/quiz/submit', (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers))
    return res.status(400).json({ message: 'Invalid submission' });

  // Score based on answers array - each answer has selectedOption and correctIndex
  let correct = 0;
  answers.forEach(a => {
    if (a.selectedOption === a.correctIndex) correct++;
  });

  const score = Math.round((correct / answers.length) * 100);
  const passed = score >= 70;

  if (passed) {
    const idx = users.findIndex(u => u.id === req.userId);
    if (idx !== -1) {
      const dom = domain;
      if (!users[idx].progress[dom]) users[idx].progress[dom] = { currentLevel: 1, unlockedLevels: [1] };
      const nextLevel = parseInt(level) + 1;
      if (!users[idx].progress[dom].unlockedLevels.includes(nextLevel))
        users[idx].progress[dom].unlockedLevels.push(nextLevel);
      users[idx].progress[dom].currentLevel = Math.max(nextLevel, users[idx].progress[dom].currentLevel);
    }
  }

  res.json({
    success: true,
    result: { score, passed, correctAnswers: correct, totalQuestions: answers.length, nextLevelUnlocked: passed }
  });
});

// DOMAINS - no auth required
app.get('/api/domains', (req, res) => {
  res.json([
    { id: 'IT',          name: 'IT & Web Development',  icon: '💻' },
    { id: 'DataScience', name: 'Data Science & AI',      icon: '📊' },
    { id: 'Healthcare',  name: 'Healthcare',             icon: '🏥' },
    { id: 'Finance',     name: 'Finance',                icon: '💰' },
    { id: 'Aptitude',    name: 'Aptitude',               icon: '🧠' },
    { id: 'Interview',   name: 'Interview Prep',         icon: '🎤' }
  ]);
});

// PROGRESS - no auth required
app.get('/api/progress', (req, res) => {
  res.json({
    IT:          { currentLevel: 1, unlockedLevels: [1] },
    DataScience: { currentLevel: 1, unlockedLevels: [1] },
    Healthcare:  { currentLevel: 1, unlockedLevels: [1] },
    Finance:     { currentLevel: 1, unlockedLevels: [1] },
    Aptitude:    { currentLevel: 1, unlockedLevels: [1] },
    Interview:   { currentLevel: 1, unlockedLevels: [1] }
  });
});

// ─── Serve React build in production ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ CareerPath Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 Backend:  http://localhost:${PORT}`);
  console.log(`👤 Demo:     demo@careerpath.com / demo123\n`);
});

process.on('uncaughtException', err => console.error('Uncaught:', err.message));
process.on('unhandledRejection', err => console.error('Unhandled:', err));
