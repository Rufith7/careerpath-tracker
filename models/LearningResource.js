const mongoose = require('mongoose');

const LearningResourceSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
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
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['article', 'video', 'course', 'documentation', 'practice', 'tutorial'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  estimatedTime: {
    type: Number, // minutes
    required: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tags: [String],
  prerequisites: [String],
  learningObjectives: [String],
  contentExtracted: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
LearningResourceSchema.index({ domain: 1, level: 1, difficulty: 1 });
LearningResourceSchema.index({ topic: 1, level: 1 });
LearningResourceSchema.index({ platform: 1, type: 1 });

module.exports = mongoose.model('LearningResource', LearningResourceSchema);