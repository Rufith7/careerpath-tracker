const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  badgeIcon: String,
  badgeColor: { type: String, default: '#ffd700' },
  earnedAt: { type: Date, default: Date.now },
  category: { 
    type: String, 
    enum: ['course', 'quiz', 'project', 'streak', 'milestone'],
    default: 'course'
  },
  points: { type: Number, default: 10 }
});

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const quizResultSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  skillId: String,
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeSpent: { type: Number, default: 0 }, // in seconds
  attempts: { type: Number, default: 1 },
  passed: { type: Boolean, default: false },
  answers: [{
    questionId: String,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  completedAt: { type: Date, default: Date.now }
});

const learningStreakSchema = new mongoose.Schema({
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: Date,
  streakStartDate: Date,
  totalActiveDays: { type: Number, default: 0 }
});

const skillProgressSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  maxExperience: { type: Number, default: 100 },
  completedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  completedProjects: [String],
  lastPracticed: Date,
  proficiencyLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  }
});

const careerGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  targetDate: Date,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  milestones: [{
    title: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: String,
  
  // Profile Information
  profile: {
    age: Number,
    location: String,
    education: {
      level: { type: String, enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Other'] },
      field: String,
      institution: String,
      graduationYear: Number
    },
    experience: {
      level: { type: String, enum: ['Fresher', '1-2 years', '3-5 years', '5+ years'] },
      currentRole: String,
      company: String,
      industry: String
    },
    interests: [String],
    strengths: [String],
    careerGoals: [careerGoalSchema],
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    bio: String
  },

  // Learning Preferences
  learningPreferences: {
    preferredLearningStyle: { 
      type: String, 
      enum: ['Visual', 'Auditory', 'Kinesthetic', 'Reading'],
      default: 'Visual'
    },
    dailyLearningTime: { type: Number, default: 60 }, // minutes
    preferredDifficulty: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    }
  },

  // Career Development
  selectedDomain: { 
    type: String,
    enum: [
      'IT', 'Finance', 'Healthcare', 'Mechanical-Engineering', 
      'Research', 'Construction', 'Logistics', 'Creative-Arts',
      'Aviation', 'Renewable-Energy'
    ]
  },
  selectedCareerPath: String,
  
  // Progress Tracking
  progress: {
    currentLevel: { type: Number, default: 1 },
    totalExperience: { type: Number, default: 0 },
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    completedSkills: [skillProgressSchema],
    completionPercentage: { type: Number, default: 0 },
    quizResults: [quizResultSchema],
    learningStreak: learningStreakSchema,
    totalLearningHours: { type: Number, default: 0 },
    certificatesEarned: [{
      name: String,
      provider: String,
      earnedAt: Date,
      certificateUrl: String,
      verificationId: String
    }]
  },

  // Gamification
  gamification: {
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [achievementSchema],
    achievements: [achievementSchema],
    rank: String,
    leaderboardPosition: Number
  },

  // Content
  notes: [noteSchema],
  bookmarks: [{
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    resourceType: String,
    bookmarkedAt: { type: Date, default: Date.now }
  }],

  // AI Interactions
  aiInteractions: [{
    query: String,
    response: String,
    category: String,
    satisfaction: { type: Number, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now }
  }],

  // Resume & CV
  resume: {
    template: { type: String, default: 'modern' },
    sections: {
      personalInfo: Object,
      summary: String,
      experience: [Object],
      education: [Object],
      skills: [Object],
      projects: [Object],
      certifications: [Object],
      achievements: [Object]
    },
    lastUpdated: Date,
    downloadCount: { type: Number, default: 0 }
  },

  // Settings
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    language: { type: String, default: 'en' },
    timezone: String,
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'private' },
      showProgress: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true }
    }
  },

  // Metadata
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ selectedDomain: 1 });
userSchema.index({ 'progress.currentLevel': 1 });
userSchema.index({ 'gamification.totalPoints': -1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update learning streak
userSchema.methods.updateLearningStreak = function() {
  const today = new Date();
  const lastActivity = this.progress.learningStreak.lastActivityDate;
  
  if (!lastActivity) {
    this.progress.learningStreak.currentStreak = 1;
    this.progress.learningStreak.streakStartDate = today;
  } else {
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      this.progress.learningStreak.currentStreak += 1;
    } else if (daysDiff > 1) {
      this.progress.learningStreak.currentStreak = 1;
      this.progress.learningStreak.streakStartDate = today;
    }
  }
  
  this.progress.learningStreak.lastActivityDate = today;
  this.progress.learningStreak.longestStreak = Math.max(
    this.progress.learningStreak.longestStreak,
    this.progress.learningStreak.currentStreak
  );
  this.progress.learningStreak.totalActiveDays += 1;
};

// Method to add experience points
userSchema.methods.addExperience = function(points, category = 'general') {
  this.progress.totalExperience += points;
  this.gamification.totalPoints += points;
  
  // Level up logic
  const newLevel = Math.floor(this.progress.totalExperience / 1000) + 1;
  if (newLevel > this.gamification.level) {
    this.gamification.level = newLevel;
    // Add level up achievement
    this.gamification.achievements.push({
      title: `Level ${newLevel} Reached!`,
      description: `Congratulations on reaching level ${newLevel}`,
      category: 'milestone',
      points: 50
    });
  }
};

module.exports = mongoose.model('User', userSchema);