const express = require('express');
const router = express.Router();
const ResumeEnhancementEngine = require('../services/ResumeEnhancementEngine');

// Initialize the resume enhancement engine
const resumeEngine = new ResumeEnhancementEngine();

// Enhance existing resume
router.post('/enhance', async (req, res) => {
  try {
    const { resumeData, targetRole, domain } = req.body;

    if (!resumeData || !targetRole || !domain) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: resumeData, targetRole, domain'
      });
    }

    const result = await resumeEngine.enhanceResume(resumeData, targetRole, domain);
    
    res.json(result);
  } catch (error) {
    console.error('Resume enhancement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enhance resume'
    });
  }
});

// Generate resume template
router.post('/template', async (req, res) => {
  try {
    const { userProfile, targetRole } = req.body;

    if (!userProfile || !targetRole) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userProfile, targetRole'
      });
    }

    const template = resumeEngine.generateResumeTemplate(userProfile, targetRole);
    
    res.json({
      success: true,
      template,
      message: 'Resume template generated successfully'
    });
  } catch (error) {
    console.error('Resume template generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate resume template'
    });
  }
});

// Analyze resume for ATS score
router.post('/analyze', async (req, res) => {
  try {
    const { resumeData, targetRole, domain } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: resumeData'
      });
    }

    const analysis = resumeEngine.analyzeResume(resumeData);
    const keywords = resumeEngine.extractRelevantKeywords(targetRole || 'General', domain || 'IT');
    const atsScore = resumeEngine.calculateATSScore(resumeData, keywords);
    const recommendations = resumeEngine.generateRecommendations(analysis, atsScore);

    res.json({
      success: true,
      analysis,
      atsScore,
      recommendations,
      keywords: keywords.required.slice(0, 10), // Top 10 keywords
      message: 'Resume analysis completed successfully'
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume'
    });
  }
});

// Get role-specific keywords
router.get('/keywords/:role/:domain?', async (req, res) => {
  try {
    const { role, domain } = req.params;
    
    const keywords = resumeEngine.extractRelevantKeywords(role, domain || 'IT');
    
    res.json({
      success: true,
      keywords,
      role,
      domain: domain || 'IT',
      message: 'Keywords retrieved successfully'
    });
  } catch (error) {
    console.error('Keywords retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve keywords'
    });
  }
});

// Get resume writing tips
router.get('/tips/:intent?', async (req, res) => {
  try {
    const { intent } = req.params;
    
    const tips = {
      general: [
        "Use strong action verbs to start bullet points",
        "Quantify achievements with specific numbers and percentages",
        "Tailor your resume to each job application",
        "Keep it concise - ideally 1-2 pages",
        "Use a clean, professional format",
        "Include relevant keywords from the job description",
        "Proofread carefully for grammar and spelling errors"
      ],
      ats: [
        "Use standard section headers (Experience, Education, Skills)",
        "Avoid tables, graphics, and complex formatting",
        "Include keywords naturally throughout the resume",
        "Use common fonts like Arial, Calibri, or Times New Roman",
        "Save as both PDF and Word formats",
        "Don't use headers or footers for important information",
        "Spell out acronyms at least once"
      ],
      content: [
        "Focus on achievements, not just responsibilities",
        "Use the STAR method for describing accomplishments",
        "Include relevant projects and certifications",
        "Show progression and growth in your career",
        "Highlight transferable skills for career changes",
        "Include volunteer work if relevant",
        "Keep information current and relevant"
      ],
      technical: [
        "List programming languages and frameworks",
        "Include relevant tools and technologies",
        "Mention version control systems (Git, SVN)",
        "Highlight database experience",
        "Include cloud platform experience",
        "Mention agile/scrum experience",
        "Add links to GitHub or portfolio"
      ]
    };

    const selectedTips = tips[intent] || tips.general;
    
    res.json({
      success: true,
      tips: selectedTips,
      category: intent || 'general',
      message: 'Resume tips retrieved successfully'
    });
  } catch (error) {
    console.error('Tips retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tips'
    });
  }
});

// Get industry-specific resume advice
router.get('/industry-advice/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    const industryAdvice = {
      'IT': {
        keySkills: ['Programming Languages', 'Frameworks', 'Databases', 'Cloud Platforms', 'DevOps Tools'],
        sections: ['Technical Skills', 'Projects', 'Certifications', 'Open Source Contributions'],
        tips: [
          "Highlight your technical stack prominently",
          "Include links to GitHub and live projects",
          "Mention specific technologies and versions",
          "Show problem-solving abilities with examples",
          "Include relevant certifications (AWS, Google Cloud, etc.)"
        ]
      },
      'DataScience': {
        keySkills: ['Python/R', 'Machine Learning', 'Statistics', 'Data Visualization', 'Big Data Tools'],
        sections: ['Technical Skills', 'Projects', 'Publications', 'Kaggle Competitions'],
        tips: [
          "Showcase data science projects with measurable impact",
          "Include links to Kaggle profile or data science portfolio",
          "Mention specific ML algorithms and tools used",
          "Highlight business impact of your analyses",
          "Include relevant coursework or certifications"
        ]
      },
      'Finance': {
        keySkills: ['Financial Analysis', 'Excel/VBA', 'Risk Management', 'Regulatory Knowledge'],
        sections: ['Certifications', 'Financial Achievements', 'Regulatory Experience'],
        tips: [
          "Quantify financial impact of your work",
          "Include relevant certifications (CFA, FRM, etc.)",
          "Highlight regulatory compliance experience",
          "Show proficiency with financial software",
          "Mention specific financial instruments or markets"
        ]
      },
      'Healthcare': {
        keySkills: ['Clinical Experience', 'Medical Knowledge', 'Patient Care', 'Healthcare IT'],
        sections: ['Clinical Experience', 'Certifications', 'Continuing Education'],
        tips: [
          "Highlight patient outcomes and care quality",
          "Include all relevant certifications and licenses",
          "Show commitment to continuing education",
          "Mention specific medical technologies or systems",
          "Include volunteer or community health work"
        ]
      }
    };

    const advice = industryAdvice[domain] || {
      keySkills: ['Communication', 'Problem Solving', 'Leadership', 'Project Management'],
      sections: ['Experience', 'Education', 'Skills', 'Achievements'],
      tips: [
        "Focus on transferable skills",
        "Highlight leadership and teamwork experience",
        "Show measurable achievements",
        "Include relevant training and development",
        "Demonstrate adaptability and learning ability"
      ]
    };
    
    res.json({
      success: true,
      domain,
      advice,
      message: 'Industry-specific advice retrieved successfully'
    });
  } catch (error) {
    console.error('Industry advice retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve industry advice'
    });
  }
});

module.exports = router;