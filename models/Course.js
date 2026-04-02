const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['IT', 'Non-IT', 'Data-Analysis', 'Finance', 'Healthcare', 'Medical', 
           'Mechanical-Engineering', 'Research', 'Construction', 'Logistics', 
           'Creative-Arts', 'Aviation', 'Renewable-Energy']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
    required: true
  },
  levelNumber: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  skills: [String],
  resources: [{
    title: String,
    type: { type: String, enum: ['video', 'article', 'practice', 'documentation'] },
    url: String,
    platform: String,
    isFree: { type: Boolean, default: true },
    description: String
  }],
  roadmapPosition: {
    x: Number,
    y: Number
  },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  estimatedHours: Number,
  difficulty: {
    type: Number,
    min: 1,
    max: 10
  },
  tags: [String],
  isLocked: {
    type: Boolean,
    default: true
  },
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    passingScore: { type: Number, default: 70 },
    timeLimit: { type: Number, default: 30 } // minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);