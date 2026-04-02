const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'article', 'course', 'practice', 'documentation', 'certification'],
    required: true 
  },
  url: { type: String, required: true },
  platform: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  duration: String,
  isFree: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  description: String,
  tags: [String],
  prerequisites: [String]
});

const skillPathSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  level: { type: Number, required: true },
  description: String,
  estimatedHours: { type: Number, default: 0 },
  resources: [resourceSchema],
  projects: [{
    title: String,
    description: String,
    difficulty: String,
    estimatedHours: Number,
    githubUrl: String,
    liveUrl: String
  }],
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
      difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
    }],
    passingScore: { type: Number, default: 70 },
    timeLimit: { type: Number, default: 30 }
  }
});

const careerPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  averageSalary: {
    entry: Number,
    mid: Number,
    senior: Number,
    currency: { type: String, default: 'USD' }
  },
  jobTitles: [String],
  companies: [String],
  skills: [skillPathSchema],
  totalEstimatedHours: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }
});

const domainSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: [
      'IT', 'Finance', 'Healthcare', 'Mechanical-Engineering', 
      'Research', 'Construction', 'Logistics', 'Creative-Arts',
      'Aviation', 'Renewable-Energy'
    ]
  },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  color: { type: String, default: '#3b82f6' },
  marketTrends: {
    growth: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    demand: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    averageSalary: Number,
    jobOpenings: Number,
    topSkills: [String]
  },
  careerPaths: [careerPathSchema],
  industryInsights: [{
    title: String,
    content: String,
    source: String,
    publishedAt: Date
  }],
  certifications: [{
    name: String,
    provider: String,
    url: String,
    cost: Number,
    duration: String,
    difficulty: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
domainSchema.index({ name: 1 });
domainSchema.index({ 'careerPaths.skills.skill': 1 });

module.exports = mongoose.model('Domain', domainSchema);