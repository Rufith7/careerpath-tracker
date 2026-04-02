const express = require('express');
const router = express.Router();
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const AIQuizGenerator = require('../services/AIQuizGenerator');

// Middleware to check authentication
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Generate quiz for specific domain, topic, and level
router.post('/generate', auth, async (req, res) => {
  try {
    const { domain, topic, level, difficulty = 'Medium', questionCount = 10 } = req.body;

    if (!domain || !topic || !level) {
      return res.status(400).json({ 
        message: 'Domain, topic, and level are required' 
      });
    }

    // Check if user has access to this level
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate quiz using AI
    const questions = await AIQuizGenerator.generateQuiz(
      domain, 
      topic, 
      level, 
      difficulty, 
      questionCount
    );

    // Remove correct answers from response (send to frontend without answers)
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

// Get quiz by domain and level
router.get('/:domain/:level', auth, async (req, res) => {
  try {
    const { domain, level } = req.params;
    const { topic, difficulty = 'Medium', limit = 10 } = req.query;

    const query = {
      domain,
      level: parseInt(level),
      validated: true
    };

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const questions = await QuizQuestion.find(query)
      .limit(parseInt(limit))
      .select('-options.isCorrect') // Don't send correct answers
      .lean();

    if (questions.length === 0) {
      // Generate new questions if none exist
      const generatedQuestions = await AIQuizGenerator.generateQuiz(
        domain, 
        topic || 'General', 
        parseInt(level), 
        difficulty, 
        parseInt(limit)
      );

      const questionsForFrontend = generatedQuestions.map(q => ({
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

      return res.json({
        success: true,
        questions: questionsForFrontend,
        generated: true
      });
    }

    // Format existing questions
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
      generated: false
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
router.post('/submit', auth, async (req, res) => {
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

    // Get the original questions with correct answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await QuizQuestion.find({
      _id: { $in: questionIds }
    });

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
      const question = questions.find(q => q._id.toString() === answer.questionId);
      
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

      // Update question usage statistics
      await QuizQuestion.findByIdAndUpdate(question._id, {
        $inc: { usageCount: 1 },
        $set: { 
          successRate: isCorrect ? 
            (question.successRate * question.usageCount + 100) / (question.usageCount + 1) :
            (question.successRate * question.usageCount) / (question.usageCount + 1)
        }
      });
    }

    const score = Math.round((correctAnswers / answers.length) * 100);
    const passed = score >= 70; // 70% pass threshold

    // Create quiz attempt record
    const quizAttempt = new QuizAttempt({
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
      passThreshold: 70
    });

    // Use AI to validate results and provide feedback
    const validatedAttempt = await AIQuizGenerator.validateQuizResults(req.userId, quizAttempt);
    await validatedAttempt.save();

    // Update user progress if level unlocked
    if (validatedAttempt.nextLevelUnlocked) {
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { 
          [`progress.${domain}.unlockedLevels`]: parseInt(level) + 1 
        },
        $set: {
          [`progress.${domain}.currentLevel`]: Math.max(
            parseInt(level) + 1,
            (await User.findById(req.userId)).progress?.[domain]?.currentLevel || 1
          )
        }
      });
    }

    res.json({
      success: true,
      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions: answers.length,
        timeSpent: timeSpent || 0,
        nextLevelUnlocked: validatedAttempt.nextLevelUnlocked,
        retryRecommended: validatedAttempt.retryRecommended,
        practiceRecommended: validatedAttempt.practiceRecommended,
        feedback: validatedAttempt.feedback,
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
router.get('/history', auth, async (req, res) => {
  try {
    const { domain, limit = 10 } = req.query;
    
    const query = { userId: req.userId };
    if (domain) query.domain = domain;

    const attempts = await QuizAttempt.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-questions.explanation') // Don't send explanations in history
      .lean();

    res.json({
      success: true,
      attempts
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
router.get('/stats/:domain', auth, async (req, res) => {
  try {
    const { domain } = req.params;
    
    const stats = await QuizAttempt.aggregate([
      { $match: { userId: req.userId, domain } },
      {
        $group: {
          _id: '$level',
          totalAttempts: { $sum: 1 },
          passedAttempts: { 
            $sum: { $cond: ['$passed', 1, 0] } 
          },
          averageScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const overallStats = await QuizAttempt.aggregate([
      { $match: { userId: req.userId, domain } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalPassed: { 
            $sum: { $cond: ['$passed', 1, 0] } 
          },
          overallAverage: { $avg: '$score' },
          totalLearningTime: { $sum: '$timeSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byLevel: stats,
        overall: overallStats[0] || {
          totalQuizzes: 0,
          totalPassed: 0,
          overallAverage: 0,
          totalLearningTime: 0
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

// Get available topics for a domain
router.get('/topics/:domain', auth, async (req, res) => {
  try {
    const { domain } = req.params;
    
    const topics = await QuizQuestion.distinct('topic', { 
      domain, 
      validated: true 
    });

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

module.exports = router;