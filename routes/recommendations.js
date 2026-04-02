const express = require('express');
const router = express.Router();
const ResourceRecommendationEngine = require('../services/ResourceRecommendationEngine');

// Initialize the recommendation engine
const recommendationEngine = new ResourceRecommendationEngine();

// Get personalized resource recommendations
router.post('/resources', async (req, res) => {
  try {
    const { userProfile, topic, limit } = req.body;

    if (!userProfile || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userProfile, topic'
      });
    }

    const recommendations = await recommendationEngine.getRecommendations(
      userProfile, 
      topic, 
      limit || 10
    );
    
    res.json(recommendations);
  } catch (error) {
    console.error('Resource recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resource recommendations'
    });
  }
});

// Get trending resources for a domain
router.get('/trending/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const { limit } = req.query;
    
    const trendingResources = recommendationEngine.getTrendingResources(
      domain, 
      parseInt(limit) || 5
    );
    
    res.json({
      success: true,
      domain,
      resources: trendingResources,
      message: 'Trending resources retrieved successfully'
    });
  } catch (error) {
    console.error('Trending resources error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trending resources'
    });
  }
});

// Track user interaction with a resource
router.post('/track-interaction', async (req, res) => {
  try {
    const { userId, resourceId, rating, topic } = req.body;

    if (!userId || !resourceId || !rating || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, resourceId, rating, topic'
      });
    }

    recommendationEngine.trackUserInteraction(userId, resourceId, rating, topic);
    
    res.json({
      success: true,
      message: 'User interaction tracked successfully'
    });
  } catch (error) {
    console.error('Track interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track user interaction'
    });
  }
});

// Get resource recommendations by learning path
router.post('/learning-path', async (req, res) => {
  try {
    const { userProfile, targetRole, timeframe } = req.body;

    if (!userProfile || !targetRole) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userProfile, targetRole'
      });
    }

    // Generate learning path recommendations
    const learningPath = await generateLearningPath(userProfile, targetRole, timeframe);
    
    res.json({
      success: true,
      learningPath,
      targetRole,
      timeframe: timeframe || '3 months',
      message: 'Learning path generated successfully'
    });
  } catch (error) {
    console.error('Learning path error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate learning path'
    });
  }
});

// Get personalized study schedule
router.post('/study-schedule', async (req, res) => {
  try {
    const { userProfile, availableHours, preferences } = req.body;

    if (!userProfile || !availableHours) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userProfile, availableHours'
      });
    }

    const studySchedule = generateStudySchedule(userProfile, availableHours, preferences);
    
    res.json({
      success: true,
      schedule: studySchedule,
      totalHours: availableHours,
      message: 'Study schedule generated successfully'
    });
  } catch (error) {
    console.error('Study schedule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate study schedule'
    });
  }
});

// Get skill gap analysis and recommendations
router.post('/skill-gap-analysis', async (req, res) => {
  try {
    const { userProfile, targetRole, currentSkills } = req.body;

    if (!userProfile || !targetRole || !currentSkills) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userProfile, targetRole, currentSkills'
      });
    }

    const skillGapAnalysis = analyzeSkillGaps(userProfile, targetRole, currentSkills);
    
    res.json({
      success: true,
      analysis: skillGapAnalysis,
      targetRole,
      message: 'Skill gap analysis completed successfully'
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform skill gap analysis'
    });
  }
});

// Get resource recommendations by skill level
router.get('/by-level/:domain/:level', async (req, res) => {
  try {
    const { domain, level } = req.params;
    const { limit } = req.query;
    
    const userProfile = {
      domain,
      level,
      id: 'anonymous'
    };

    const recommendations = await recommendationEngine.getRecommendations(
      userProfile, 
      'General', 
      parseInt(limit) || 10
    );
    
    res.json({
      ...recommendations,
      domain,
      level,
      message: 'Level-based recommendations retrieved successfully'
    });
  } catch (error) {
    console.error('Level-based recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get level-based recommendations'
    });
  }
});

// Helper function to generate learning path
async function generateLearningPath(userProfile, targetRole, timeframe = '3 months') {
  const learningPaths = {
    'Software Engineer': {
      beginner: [
        { phase: 'Foundation', duration: '4 weeks', topics: ['HTML', 'CSS', 'JavaScript Basics'] },
        { phase: 'Framework', duration: '4 weeks', topics: ['React', 'Node.js'] },
        { phase: 'Database', duration: '2 weeks', topics: ['SQL', 'MongoDB'] },
        { phase: 'Projects', duration: '2 weeks', topics: ['Portfolio Projects', 'Git/GitHub'] }
      ],
      intermediate: [
        { phase: 'Advanced JS', duration: '3 weeks', topics: ['ES6+', 'Async Programming', 'Testing'] },
        { phase: 'Backend', duration: '4 weeks', topics: ['Express.js', 'APIs', 'Authentication'] },
        { phase: 'DevOps', duration: '3 weeks', topics: ['Docker', 'AWS', 'CI/CD'] },
        { phase: 'System Design', duration: '2 weeks', topics: ['Architecture', 'Scalability'] }
      ]
    },
    'Data Scientist': {
      beginner: [
        { phase: 'Python Basics', duration: '3 weeks', topics: ['Python', 'Pandas', 'NumPy'] },
        { phase: 'Statistics', duration: '3 weeks', topics: ['Statistics', 'Probability', 'Hypothesis Testing'] },
        { phase: 'Visualization', duration: '2 weeks', topics: ['Matplotlib', 'Seaborn', 'Plotly'] },
        { phase: 'ML Basics', duration: '4 weeks', topics: ['Scikit-learn', 'Linear Regression', 'Classification'] }
      ],
      intermediate: [
        { phase: 'Advanced ML', duration: '4 weeks', topics: ['Deep Learning', 'Neural Networks', 'TensorFlow'] },
        { phase: 'Big Data', duration: '3 weeks', topics: ['Spark', 'Hadoop', 'SQL'] },
        { phase: 'Specialization', duration: '3 weeks', topics: ['NLP', 'Computer Vision', 'Time Series'] },
        { phase: 'Deployment', duration: '2 weeks', topics: ['MLOps', 'Model Deployment', 'Monitoring'] }
      ]
    }
  };

  const path = learningPaths[targetRole]?.[userProfile.level] || learningPaths['Software Engineer']['beginner'];
  
  // Get resource recommendations for each phase
  const pathWithResources = await Promise.all(
    path.map(async (phase) => {
      const resources = [];
      for (const topic of phase.topics) {
        const topicRecommendations = await recommendationEngine.getRecommendations(
          userProfile, 
          topic, 
          3
        );
        if (topicRecommendations.success) {
          resources.push(...topicRecommendations.recommendations);
        }
      }
      return {
        ...phase,
        resources: resources.slice(0, 5) // Top 5 resources per phase
      };
    })
  );

  return {
    targetRole,
    level: userProfile.level,
    timeframe,
    phases: pathWithResources,
    totalDuration: path.reduce((total, phase) => {
      const weeks = parseInt(phase.duration.split(' ')[0]);
      return total + weeks;
    }, 0)
  };
}

// Helper function to generate study schedule
function generateStudySchedule(userProfile, availableHours, preferences = {}) {
  const { studyDays = 5, preferredTime = 'evening', intensity = 'moderate' } = preferences;
  
  const hoursPerDay = availableHours / studyDays;
  const intensityMultiplier = {
    light: 0.7,
    moderate: 1.0,
    intensive: 1.3
  };

  const effectiveHours = hoursPerDay * (intensityMultiplier[intensity] || 1.0);
  
  const schedule = {
    weeklyHours: availableHours,
    dailyHours: hoursPerDay,
    studyDays,
    preferredTime,
    intensity,
    recommendations: []
  };

  // Generate daily recommendations
  const activities = [
    { type: 'theory', name: 'Conceptual Learning', percentage: 0.4 },
    { type: 'practice', name: 'Hands-on Practice', percentage: 0.4 },
    { type: 'review', name: 'Review & Reinforcement', percentage: 0.2 }
  ];

  activities.forEach(activity => {
    const timeAllocation = effectiveHours * activity.percentage;
    schedule.recommendations.push({
      activity: activity.name,
      type: activity.type,
      dailyTime: timeAllocation,
      weeklyTime: timeAllocation * studyDays,
      description: getActivityDescription(activity.type, userProfile.domain)
    });
  });

  return schedule;
}

// Helper function to get activity descriptions
function getActivityDescription(type, domain) {
  const descriptions = {
    theory: {
      'IT': 'Read documentation, watch tutorials, understand concepts',
      'DataScience': 'Study algorithms, statistical concepts, and theory',
      'Finance': 'Learn financial principles, regulations, and market dynamics'
    },
    practice: {
      'IT': 'Code projects, solve problems, build applications',
      'DataScience': 'Work on datasets, implement algorithms, create models',
      'Finance': 'Analyze financial data, create models, practice calculations'
    },
    review: {
      'IT': 'Review code, take quizzes, discuss with peers',
      'DataScience': 'Review models, validate results, document findings',
      'Finance': 'Review analyses, practice case studies, mock interviews'
    }
  };

  return descriptions[type][domain] || descriptions[type]['IT'];
}

// Helper function to analyze skill gaps
function analyzeSkillGaps(userProfile, targetRole, currentSkills) {
  const roleRequirements = {
    'Software Engineer': {
      required: ['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'],
      preferred: ['React', 'Node.js', 'SQL', 'Testing', 'Agile'],
      advanced: ['System Design', 'DevOps', 'Cloud Computing', 'Microservices']
    },
    'Data Scientist': {
      required: ['Python', 'Statistics', 'SQL', 'Data Analysis'],
      preferred: ['Machine Learning', 'Pandas', 'Visualization', 'R'],
      advanced: ['Deep Learning', 'Big Data', 'MLOps', 'Domain Expertise']
    },
    'Product Manager': {
      required: ['Product Strategy', 'User Research', 'Analytics', 'Communication'],
      preferred: ['Agile', 'Roadmapping', 'A/B Testing', 'Stakeholder Management'],
      advanced: ['Growth Hacking', 'Data Science', 'Technical Knowledge', 'Leadership']
    }
  };

  const requirements = roleRequirements[targetRole] || roleRequirements['Software Engineer'];
  const currentSkillsLower = currentSkills.map(skill => skill.toLowerCase());

  const analysis = {
    targetRole,
    currentSkills,
    gaps: {
      critical: [],
      important: [],
      nice_to_have: []
    },
    strengths: [],
    recommendations: []
  };

  // Identify gaps
  requirements.required.forEach(skill => {
    if (!currentSkillsLower.includes(skill.toLowerCase())) {
      analysis.gaps.critical.push(skill);
    } else {
      analysis.strengths.push(skill);
    }
  });

  requirements.preferred.forEach(skill => {
    if (!currentSkillsLower.includes(skill.toLowerCase())) {
      analysis.gaps.important.push(skill);
    } else {
      analysis.strengths.push(skill);
    }
  });

  requirements.advanced.forEach(skill => {
    if (!currentSkillsLower.includes(skill.toLowerCase())) {
      analysis.gaps.nice_to_have.push(skill);
    } else {
      analysis.strengths.push(skill);
    }
  });

  // Generate recommendations
  if (analysis.gaps.critical.length > 0) {
    analysis.recommendations.push({
      priority: 'high',
      action: `Focus immediately on: ${analysis.gaps.critical.slice(0, 3).join(', ')}`,
      timeframe: '1-2 months'
    });
  }

  if (analysis.gaps.important.length > 0) {
    analysis.recommendations.push({
      priority: 'medium',
      action: `Develop skills in: ${analysis.gaps.important.slice(0, 3).join(', ')}`,
      timeframe: '2-4 months'
    });
  }

  if (analysis.gaps.nice_to_have.length > 0) {
    analysis.recommendations.push({
      priority: 'low',
      action: `Consider learning: ${analysis.gaps.nice_to_have.slice(0, 2).join(', ')}`,
      timeframe: '4-6 months'
    });
  }

  return analysis;
}

module.exports = router;