const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config(); // 🔥 IMPORTANT

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

// ─── In-Memory Data ─────────────────────────────────────────
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@careerpath.com',
    password: '$2a$10$L0yBU4IouDRKQH5296jO1uq4F2DdH7Nh15yHfFdSE9aamnIHBjtCy',
    selectedDomain: 'IT',
    progress: {
      IT: { currentLevel: 1, unlockedLevels: [1] },
      DataScience: { currentLevel: 1, unlockedLevels: [1] },
      Healthcare: { currentLevel: 1, unlockedLevels: [1] },
      Finance: { currentLevel: 1, unlockedLevels: [1] },
      Aptitude: { currentLevel: 1, unlockedLevels: [1] },
      Interview: { currentLevel: 1, unlockedLevels: [1] }
    }
  }
];

// ─── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ─── Auth Middleware ────────────────────────────────────────
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

// ─── Routes ─────────────────────────────────────────────────

// HEALTH
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', port: PORT });
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password too short' });

    const exists = users.find(u => u.email === email.toLowerCase());
    if (exists)
      return res.status(400).json({ message: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: String(Date.now()),
      name,
      email: email.toLowerCase(),
      password: hashed,
      selectedDomain: null,
      progress: users[0].progress
    };

    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password: _, ...safeUser } = newUser;

    res.status(201).json({ token, user: safeUser });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email.toLowerCase());
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password: _, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ME
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'Not found' });

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// DOMAINS
app.get('/api/domains', (req, res) => {
  res.json([
    { id: 'IT', name: 'IT & Web Development' },
    { id: 'DataScience', name: 'Data Science & AI' }
  ]);
});

// ─── START SERVER ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ─── ERROR HANDLING ─────────────────────────────────────────
process.on('uncaughtException', err => console.error(err));
process.on('unhandledRejection', err => console.error(err));