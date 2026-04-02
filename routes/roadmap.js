const express = require('express');
const RecommendationEngine = require('../services/RecommendationEngine');
const User = require('../models/User');
const Domain = require('../models/Domain');
const { UserActivity } = require('../models/Analytics');
const auth = require('../middleware/auth');

const router = express.Router();

// Get personalized career roadmap
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.selectedDomain) {
      return res.status(400).json({ 
        message: 'Please select a career domain first',
        redirectTo: '/domain-selection'
      });
    }

    // Generate personalized roadmap
    const roadmapData = await RecommendationEngine.generateCareerRoadmap(req.userId);

    // Log user activity
    await new UserActivity({
      userId: req.userId,
      action: 'roadmap_view',
      details: { domain: user.selectedDomain }
    }).save();

    res.json({
      success: true,
      roadmap: roadmapData,
      userInfo: {
        name: user.name,
        domain: user.selectedDomain,
        currentLevel: user.progress.currentLevel,
        completionPercentage: user.progress.completionPercentage
      }
    });

  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate roadmap',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get roadmap progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('progress.completedCourses', 'title level domain estimatedHours');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progressData = {
      currentLevel: user.progress.currentLevel,
      totalExperience: user.progress.totalExperience,
      completedCourses: user.progress.completedCourses,
      completedSkills: user.progress.completedSkills,
      learningStreak: user.progress.learningStreak,
      totalLearningHours: user.progress.totalLearningHours,
      achievements: user.gamification.achievements,
      nextMilestones: await getNextMilestones(user)
    };

    res.json({
      success: true,
      progress: progressData
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch progress'
    });
  }
});

// Update milestone progress
router.post('/milestone/:milestoneId/complete', auth, async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { skillsCompleted, hoursSpent } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user progress
    user.progress.totalLearningHours += hoursSpent || 0;
    user.updateLearningStreak();
    user.addExperience(100, 'milestone'); // 100 XP for milestone completion

    // Update completed skills
    if (skillsCompleted && Array.isArray(skillsCompleted)) {
      skillsCompleted.forEach(skill => {
        const existingSkill = user.progress.completedSkills.find(s => s.skillName === skill.name);
        if (existingSkill) {
          existingSkill.level = Math.max(existingSkill.level, skill.level);
          existingSkill.experience += skill.experience || 0;
          existingSkill.lastPracticed = new Date();
        } else {
          user.progress.completedSkills.push({
            skillName: skill.name,
            level: skill.level,
            experience: skill.experience || 0,
            lastPracticed: new Date(),
            proficiencyLevel: skill.proficiencyLevel || 'Beginner'
          });
        }
      });
    }

    // Add milestone achievement
    user.gamification.achievements.push({
      title: `Milestone Completed: ${milestoneId}`,
      description: 'Successfully completed a learning milestone',
      category: 'milestone',
      points: 100
    });

    await user.save();

    // Log user activity
    await new UserActivity({
      userId: req.userId,
      action: 'milestone_complete',
      details: { 
        milestoneId, 
        skillsCompleted: skillsCompleted?.length || 0,
        hoursSpent 
      }
    }).save();

    res.json({
      success: true,
      message: 'Milestone completed successfully!',
      experience: user.progress.totalExperience,
      level: user.gamification.level,
      newAchievements: user.gamification.achievements.slice(-1)
    });

  } catch (error) {
    console.error('Milestone completion error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to complete milestone'
    });
  }
});

// Get skill recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const recommendations = await RecommendationEngine.recommendNextCourses(
      req.userId, 
      parseInt(limit)
    );

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get recommendations'
    });
  }
});

// Update learning preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { learningStyle, dailyTime, difficulty, notifications } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update learning preferences
    if (learningStyle) user.learningPreferences.preferredLearningStyle = learningStyle;
    if (dailyTime) user.learningPreferences.dailyLearningTime = dailyTime;
    if (difficulty) user.learningPreferences.preferredDifficulty = difficulty;
    if (notifications) user.learningPreferences.notifications = { ...user.learningPreferences.notifications, ...notifications };

    user.updatedAt = new Date();
    await user.save();

    // Log user activity
    await new UserActivity({
      userId: req.userId,
      action: 'preferences_update',
      details: { learningStyle, dailyTime, difficulty }
    }).save();

    res.json({
      success: true,
      message: 'Learning preferences updated successfully',
      preferences: user.learningPreferences
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// Get learning analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get user activities in timeframe
    const activities = await UserActivity.find({
      userId: req.userId,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 });

    // Calculate analytics
    const analytics = {
      totalActivities: activities.length,
      learningHours: user.progress.totalLearningHours,
      coursesCompleted: user.progress.completedCourses.length,
      currentStreak: user.progress.learningStreak.currentStreak,
      longestStreak: user.progress.learningStreak.longestStreak,
      skillsLearned: user.progress.completedSkills.length,
      achievementsEarned: user.gamification.achievements.length,
      activityBreakdown: getActivityBreakdown(activities),
      progressTrend: getProgressTrend(activities),
      skillDistribution: getSkillDistribution(user.progress.completedSkills)
    };

    res.json({
      success: true,
      analytics,
      timeframe
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get analytics'
    });
  }
});

// Helper functions
async function getNextMilestones(user) {
  try {
    const roadmapData = await RecommendationEngine.generateCareerRoadmap(user._id);
    return roadmapData.nextMilestones || [];
  } catch (error) {
    console.error('Error getting next milestones:', error);
    return [];
  }
}

function getActivityBreakdown(activities) {
  const breakdown = {};
  activities.forEach(activity => {
    breakdown[activity.action] = (breakdown[activity.action] || 0) + 1;
  });
  return breakdown;
}

function getProgressTrend(activities) {
  const dailyProgress = {};
  activities.forEach(activity => {
    const date = activity.timestamp.toISOString().split('T')[0];
    dailyProgress[date] = (dailyProgress[date] || 0) + 1;
  });
  
  return Object.entries(dailyProgress)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, count]) => ({ date, activities: count }));
}

function getSkillDistribution(completedSkills) {
  const distribution = {};
  completedSkills.forEach(skill => {
    distribution[skill.proficiencyLevel] = (distribution[skill.proficiencyLevel] || 0) + 1;
  });
  return distribution;
}

module.exports = router;