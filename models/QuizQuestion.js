const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: ['IT', 'DataScience', 'Healthcare', 'Engineering', 'Finance', 'Research', 'Aptitude', 'Interview']
  },
  topic: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard', 'Expert']
  },
  question: {
    type: String,
    required: true,
    maxlength: 500
  },
  options: [{
    text: {
      type: String,
      required: true,
      maxlength: 200
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  explanation: {
    type: String,
    required: true,
    maxlength: 1000
  },
  source: {
    platform: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  tags: [String],
  estimatedTime: {
    type: Number,
    default: 60 // seconds
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  validated: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
QuizQuestionSchema.index({ domain: 1, level: 1, difficulty: 1 });
QuizQuestionSchema.index({ topic: 1, level: 1 });
QuizQuestionSchema.index({ validated: 1, aiGenerated: 1 });

module.exports = mongoose.model('QuizQuestion', QuizQuestionSchema);