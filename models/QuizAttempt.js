const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizQuestion',
      required: true
    },
    selectedOption: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number,
      default: 0 // seconds
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true // total time in seconds
  },
  passed: {
    type: Boolean,
    required: true
  },
  passThreshold: {
    type: Number,
    default: 70
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert']
  },
  nextLevelUnlocked: {
    type: Boolean,
    default: false
  },
  retryRecommended: {
    type: Boolean,
    default: false
  },
  practiceRecommended: {
    type: Boolean,
    default: false
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String]
  }
}, {
  timestamps: true
});

// Indexes for performance
QuizAttemptSchema.index({ userId: 1, domain: 1, level: 1 });
QuizAttemptSchema.index({ userId: 1, createdAt: -1 });
QuizAttemptSchema.index({ domain: 1, level: 1, passed: 1 });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);