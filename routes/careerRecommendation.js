const express = require('express');
const router = express.Router();
const CareerRecommendationEngine = require('../services/CareerRecommendationEngine');

// Initialize the career recommendation engine
const careerEngine = new CareerRecommendationEngine();

// Middleware to check authentication
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Analyze bio data and recommend careers
router.post('/analyze', auth, async (req, res) => {
  try {
    const bioData = req.body;
    
    if (!bioData || Object.keys(bioData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bio data is required'
      });
    }

    // Add user ID for personalization
    bioData.userId = req.userId;

    // Analyze and get career recommendations
    const result = await careerEngine.analyzeAndRecommendCareers(bioData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Career analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze career recommendations'
    });
  }
});

// Get career details by ID
router.get('/career/:careerId', auth, async (req, res) => {
  try {
    const { careerId } = req.params;
    
    // Get career details from the engine's database
    const career = careerEngine.careerDatabase.find(c => c.id === careerId);
    
    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    // Get additional insights
    const insights = {
      ...career,
      industryTrends: careerEngine.industryTrends[career.category] || {},
      relatedCareers: careerEngine.careerDatabase
        .filter(c => c.category === career.category && c.id !== careerId)
        .slice(0, 3),
      skillsBreakdown: {
        required: career.requiredSkills,
        trending: careerEngine.industryTrends[career.category]?.trending || [],
        certifications: careerEngine.getRecommendedCertifications(career)
      }
    };

    res.json({
      success: true,
      career: insights
    });
  } catch (error) {
    console.error('Career details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get career details'
    });
  }
});

// Get roadmap by domain (simplified for frontend)
router.get('/roadmap/:domain', auth, async (req, res) => {
  try {
    const { domain } = req.params;
    
    // Find careers in the specified domain/category
    const domainCareers = careerEngine.careerDatabase.filter(c => 
      c.category.toLowerCase() === domain.toLowerCase() || 
      c.title.toLowerCase().includes(domain.toLowerCase())
    );
    
    if (domainCareers.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No careers found for this domain'
      });
    }

    // Use the first career as default or most popular one
    const primaryCareer = domainCareers[0];
    
    // Generate a basic roadmap without requiring bio data
    const basicBioData = {
      personalInfo: { 
        experience: 'beginner',
        age: 25,
        education: 'bachelor'
      },
      education: 'bachelor in computer science',
      technicalSkills: [],
      softSkills: ['communication', 'teamwork'],
      careerPreferences: { industryPreference: domain.toLowerCase() }
    };
    
    const roadmaps = await careerEngine.generateCareerRoadmaps([primaryCareer], basicBioData);
    const roadmap = roadmaps[0];

    res.json({
      success: true,
      roadmap: {
        ...roadmap,
        careerTitle: primaryCareer.title,
        domain: domain,
        estimatedTimeframe: careerEngine.calculateTimeframe(primaryCareer, basicBioData),
        difficultyLevel: careerEngine.calculateDifficultyLevel(primaryCareer, basicBioData)
      }
    });
  } catch (error) {
    console.error('Domain roadmap generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate domain roadmap'
    });
  }
});

// Get personalized roadmap for a specific career
router.post('/roadmap/:careerId', auth, async (req, res) => {
  try {
    const { careerId } = req.params;
    const bioData = req.body;
    
    const career = careerEngine.careerDatabase.find(c => c.id === careerId);
    
    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    // Generate personalized roadmap
    const roadmaps = await careerEngine.generateCareerRoadmaps([career], bioData);
    const roadmap = roadmaps[0];

    res.json({
      success: true,
      roadmap: {
        ...roadmap,
        estimatedTimeframe: careerEngine.calculateTimeframe(career, bioData),
        difficultyLevel: careerEngine.calculateDifficultyLevel(career, bioData),
        successProbability: careerEngine.calculateSuccessProbability(career, bioData)
      }
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate career roadmap'
    });
  }
});

// Get all available careers with filtering
router.get('/careers', auth, async (req, res) => {
  try {
    const { category, salaryMin, salaryMax, growthRate, limit } = req.query;
    
    let careers = careerEngine.careerDatabase;
    
    // Apply filters
    if (category) {
      careers = careers.filter(c => c.category === category);
    }
    
    if (salaryMin) {
      careers = careers.filter(c => c.averageSalary.min >= parseInt(salaryMin));
    }
    
    if (salaryMax) {
      careers = careers.filter(c => c.averageSalary.max <= parseInt(salaryMax));
    }
    
    if (growthRate) {
      careers = careers.filter(c => c.growthRate === growthRate);
    }
    
    // Limit results
    if (limit) {
      careers = careers.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      careers: careers.map(career => ({
        ...career,
        industryInsights: careerEngine.industryTrends[career.category] || {}
      })),
      total: careers.length,
      filters: {
        categories: [...new Set(careerEngine.careerDatabase.map(c => c.category))],
        growthRates: [...new Set(careerEngine.careerDatabase.map(c => c.growthRate))],
        salaryRanges: {
          min: Math.min(...careerEngine.careerDatabase.map(c => c.averageSalary.min)),
          max: Math.max(...careerEngine.careerDatabase.map(c => c.averageSalary.max))
        }
      }
    });
  } catch (error) {
    console.error('Careers listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get careers list'
    });
  }
});

// Submit feedback for adaptive learning
router.post('/feedback', auth, async (req, res) => {
  try {
    const { careerId, rating, factors, comments } = req.body;
    
    if (!careerId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Career ID and rating are required'
      });
    }

    const feedback = {
      careerId,
      rating: parseInt(rating),
      factors: factors || [],
      comments: comments || '',
      timestamp: new Date()
    };

    // Track feedback for adaptive learning
    careerEngine.trackUserFeedback(req.userId, feedback);

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Update user preferences
router.post('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences || !Array.isArray(preferences)) {
      return res.status(400).json({
        success: false,
        error: 'Preferences array is required'
      });
    }

    // Update user preferences for adaptive learning
    careerEngine.updateUserPreferences(req.userId, preferences);

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

// Get industry trends and insights
router.get('/trends', auth, async (req, res) => {
  try {
    const { category } = req.query;
    
    let trends = careerEngine.industryTrends;
    
    if (category) {
      trends = { [category]: trends[category] };
    }

    // Add market insights
    const insights = Object.entries(trends).map(([industry, data]) => ({
      industry,
      ...data,
      topCareers: careerEngine.careerDatabase
        .filter(c => c.category === industry)
        .sort((a, b) => b.demandLevel.localeCompare(a.demandLevel))
        .slice(0, 3)
        .map(c => ({ id: c.id, title: c.title, demandLevel: c.demandLevel })),
      marketOutlook: data.growth_rate > 1.2 ? 'Excellent' : 
                    data.growth_rate > 1.1 ? 'Good' : 'Stable'
    }));

    res.json({
      success: true,
      trends: insights,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trends retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get industry trends'
    });
  }
});

// Get skill recommendations based on career goals
router.post('/skills/recommend', auth, async (req, res) => {
  try {
    const { targetCareers, currentSkills, timeframe } = req.body;
    
    if (!targetCareers || !Array.isArray(targetCareers)) {
      return res.status(400).json({
        success: false,
        error: 'Target careers array is required'
      });
    }

    const recommendations = [];
    
    for (const careerId of targetCareers) {
      const career = careerEngine.careerDatabase.find(c => c.id === careerId);
      if (career) {
        const requiredSkills = career.requiredSkills;
        const missingSkills = requiredSkills.filter(skill => 
          !currentSkills.includes(skill)
        );
        
        const trendingSkills = careerEngine.industryTrends[career.category]?.trending || [];
        
        recommendations.push({
          careerId: career.id,
          careerTitle: career.title,
          requiredSkills,
          missingSkills,
          trendingSkills,
          priority: missingSkills.length > 0 ? 'high' : 'medium',
          estimatedLearningTime: missingSkills.length * 2 + ' months'
        });
      }
    }

    res.json({
      success: true,
      recommendations,
      learningPath: careerEngine.generateSkillLearningPath(recommendations, timeframe)
    });
  } catch (error) {
    console.error('Skill recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get skill recommendations'
    });
  }
});

// Compare multiple careers
router.post('/compare', auth, async (req, res) => {
  try {
    const { careerIds, bioData } = req.body;
    
    if (!careerIds || !Array.isArray(careerIds) || careerIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 career IDs are required for comparison'
      });
    }

    const comparisons = [];
    
    for (const careerId of careerIds) {
      const career = careerEngine.careerDatabase.find(c => c.id === careerId);
      if (career) {
        const matchScore = bioData ? 
          careerEngine.calculateMatchScore(career, bioData) : null;
        
        comparisons.push({
          ...career,
          matchScore,
          pros: careerEngine.getCareerPros(career),
          cons: careerEngine.getCareerCons(career),
          timeToEntry: careerEngine.calculateTimeframe(career, bioData || {}),
          difficultyLevel: careerEngine.calculateDifficultyLevel(career, bioData || {})
        });
      }
    }

    // Generate comparison matrix
    const comparisonMatrix = {
      salary: comparisons.map(c => ({ 
        career: c.title, 
        min: c.averageSalary.min, 
        max: c.averageSalary.max 
      })),
      growth: comparisons.map(c => ({ 
        career: c.title, 
        rate: c.growthRate 
      })),
      demand: comparisons.map(c => ({ 
        career: c.title, 
        level: c.demandLevel 
      })),
      skills: comparisons.map(c => ({ 
        career: c.title, 
        required: c.requiredSkills.length 
      }))
    };

    res.json({
      success: true,
      comparisons,
      matrix: comparisonMatrix,
      recommendation: comparisons.sort((a, b) => 
        (b.matchScore || 0) - (a.matchScore || 0)
      )[0]?.title || 'Unable to determine best match'
    });
  } catch (error) {
    console.error('Career comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare careers'
    });
  }
});

module.exports = router;