const mongoose = require('mongoose');

const aiInteractionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sessionId: { type: String, required: true },
  query: { type: String, required: true },
  intent: { 
    type: String,
    enum: [
      'career_guidance', 'course_recommendation', 'skill_assessment',
      'interview_prep', 'resume_help', 'learning_path', 'motivation',
      'technical_question', 'general_query', 'feedback'
    ]
  },
  context: {
    currentPage: String,
    userLevel: Number,
    selectedDomain: String,
    recentActivity: [String]
  },
  response: { type: String, required: true },
  responseType: {
    type: String,
    enum: ['text', 'suggestion', 'resource_list', 'action_item'],
    default: 'text'
  },
  suggestions: [String],
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  actionItems: [{
    action: String,
    priority: { type: String, enum: ['High', 'Medium', 'Low'] },
    completed: { type: Boolean, default: false }
  }],
  satisfaction: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  feedback: String,
  processingTime: { type: Number, default: 0 }, // milliseconds
  timestamp: { type: Date, default: Date.now }
});

// Indexes
aiInteractionSchema.index({ userId: 1, timestamp: -1 });
aiInteractionSchema.index({ sessionId: 1 });
aiInteractionSchema.index({ intent: 1 });

module.exports = mongoose.model('AIInteraction', aiInteractionSchema);