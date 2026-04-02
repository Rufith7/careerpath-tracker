const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UserActivity } = require('../models/Analytics');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      profile: profile || {},
      settings: {
        theme: 'auto',
        language: 'en',
        privacy: {
          profileVisibility: 'private',
          showProgress: true,
          allowMessages: true
        }
      }
    });

    await user.save();

    // Log user activity
    await new UserActivity({
      userId: user._id,
      action: 'register',
      details: { registrationMethod: 'email' }
    }).save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      selectedDomain: user.selectedDomain,
      progress: user.progress,
      gamification: user.gamification,
      settings: user.settings,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update user login info
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Log user activity
    await new UserActivity({
      userId: user._id,
      action: 'login',
      details: { loginMethod: 'email', rememberMe }
    }).save();

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: tokenExpiry }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profile: user.profile,
      selectedDomain: user.selectedDomain,
      progress: user.progress,
      gamification: user.gamification,
      settings: user.settings,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('progress.completedCourses', 'title level domain');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'avatar', 'profile', 'selectedDomain', 'selectedCareerPath',
      'learningPreferences', 'settings'
    ];
    
    // Filter allowed updates
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    Object.keys(filteredUpdates).forEach(key => {
      if (key === 'profile' || key === 'learningPreferences' || key === 'settings') {
        user[key] = { ...user[key], ...filteredUpdates[key] };
      } else {
        user[key] = filteredUpdates[key];
      }
    });

    user.updatedAt = new Date();
    await user.save();

    // Log user activity
    await new UserActivity({
      userId: user._id,
      action: 'profile_update',
      details: { updatedFields: Object.keys(filteredUpdates) }
    }).save();

    // Return updated user without password
    const userResponse = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();

    // Log user activity
    await new UserActivity({
      userId: user._id,
      action: 'password_change'
    }).save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during password change',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout (optional - mainly for logging)
router.post('/logout', auth, async (req, res) => {
  try {
    // Log user activity
    await new UserActivity({
      userId: req.userId,
      action: 'logout'
    }).save();

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please provide your password to confirm account deletion' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    user.updatedAt = new Date();
    await user.save();

    // Log user activity
    await new UserActivity({
      userId: user._id,
      action: 'account_delete'
    }).save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during account deletion'
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user activities
    const activities = await UserActivity.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(10);

    const stats = {
      profile: {
        joinedDate: user.createdAt,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        totalPoints: user.gamification.totalPoints,
        level: user.gamification.level,
        achievements: user.gamification.achievements.length
      },
      progress: {
        completedCourses: user.progress.completedCourses.length,
        currentLevel: user.progress.currentLevel,
        completionPercentage: user.progress.completionPercentage,
        totalLearningHours: user.progress.totalLearningHours,
        learningStreak: user.progress.learningStreak
      },
      activity: {
        recentActivities: activities,
        notesCount: user.notes.length,
        bookmarksCount: user.bookmarks.length
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;