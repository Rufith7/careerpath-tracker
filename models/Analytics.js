const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    required: true,
    enum: [
      'login', 'logout', 'course_start', 'course_complete', 'quiz_attempt',
      'quiz_pass', 'note_create', 'resource_view', 'ai_interaction',
      'profile_update', 'domain_select', 'achievement_earn'
    ]
  },
  details: {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    skillId: String,
    score: Number,
    timeSpent: Number,
    resourceUrl: String,
    metadata: Object
  },
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'] }
});

const systemMetricsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  metrics: {
    totalUsers: Number,
    activeUsers: Number,
    newRegistrations: Number,
    coursesCompleted: Number,
    quizzesTaken: Number,
    aiInteractions: Number,
    averageSessionTime: Number,
    topDomains: [{ domain: String, count: Number }],
    topCourses: [{ courseId: String, completions: Number }]
  },
  performance: {
    averageResponseTime: Number,
    errorRate: Number,
    uptime: Number
  }
});

// Indexes
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ action: 1, timestamp: -1 });
systemMetricsSchema.index({ date: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
const SystemMetrics = mongoose.model('SystemMetrics', systemMetricsSchema);

module.exports = { UserActivity, SystemMetrics };