const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('progress.completedCourses')
      .select('progress');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get total courses for the user's domain
    const totalCourses = await Course.countDocuments({ 
      domain: user.selectedDomain || 'IT' 
    });

    const progressData = {
      ...user.progress.toObject(),
      totalCourses,
      completionPercentage: totalCourses > 0 
        ? Math.round((user.progress.completedCourses.length / totalCourses) * 100)
        : 0
    };

    res.json(progressData);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress
router.post('/update', auth, async (req, res) => {
  try {
    const { courseId, completed } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (completed && !user.progress.completedCourses.includes(courseId)) {
      user.progress.completedCourses.push(courseId);
      
      // Add achievement
      user.achievements.push({
        title: `Completed ${course.title}`,
        description: `Successfully completed the ${course.level} level course`,
        badgeIcon: 'trophy'
      });
    }

    // Update completion percentage
    const totalCourses = await Course.countDocuments({ 
      domain: user.selectedDomain || course.domain 
    });
    
    user.progress.completionPercentage = totalCourses > 0 
      ? Math.round((user.progress.completedCourses.length / totalCourses) * 100)
      : 0;

    await user.save();

    res.json(user.progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlock next level
router.post('/unlock-next', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.progress.currentLevel += 1;
    await user.save();

    res.json(user.progress);
  } catch (error) {
    console.error('Unlock next level error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;