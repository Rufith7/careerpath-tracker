/**
 * AI-Powered Career Recommendation Engine
 * Uses Decision Tree + Adaptive Learning Algorithm to analyze bio data and suggest careers
 */

const EnhancedCareerDatabase = require('./EnhancedCareerDatabase');

class CareerRecommendationEngine {
  constructor() {
    this.careerDatabase = EnhancedCareerDatabase.getCareerDatabase();
    this.aptitudeGoals = EnhancedCareerDatabase.getAptitudeAndInterviewGoals();
    this.skillsDatabase = this.initializeSkillsDatabase();
    this.industryTrends = this.initializeIndustryTrends();
    this.userInteractions = new Map(); // For adaptive learning
  }

  /**
   * Main method to analyze bio data and recommend careers
   */
  async analyzeAndRecommendCareers(bioData) {
    try {
      // Step 1: Normalize and validate input data
      const normalizedData = this.normalizeBioData(bioData);
      
      // Step 2: Apply Decision Tree Algorithm
      const decisionTreeResults = this.applyDecisionTree(normalizedData);
      
      // Step 3: Apply Adaptive Learning Algorithm
      const adaptiveResults = this.applyAdaptiveLearning(normalizedData, decisionTreeResults);
      
      // Step 4: Generate comprehensive career recommendations
      const recommendations = this.generateCareerRecommendations(adaptiveResults, normalizedData);
      
      // Step 5: Create personalized roadmaps
      const roadmaps = await this.generateCareerRoadmaps(recommendations, normalizedData);
      
      return {
        success: true,
        analysis: {
          personalityProfile: this.generatePersonalityProfile(normalizedData),
          skillsAssessment: this.assessCurrentSkills(normalizedData),
          careerMatches: recommendations,
          industryInsights: this.getIndustryInsights(recommendations),
          confidenceScore: this.calculateConfidenceScore(normalizedData, recommendations)
        },
        recommendations: recommendations.slice(0, 5), // Top 5 recommendations
        roadmaps: roadmaps,
        nextSteps: this.generateNextSteps(recommendations[0], normalizedData)
      };
    } catch (error) {
      console.error('Career recommendation error:', error);
      return {
        success: false,
        error: 'Failed to analyze career recommendations'
      };
    }
  }

  /**
   * Normalize and validate bio data
   */
  normalizeBioData(bioData) {
    return {
      // Personal Information
      age: parseInt(bioData.age) || 25,
      education: bioData.education?.toLowerCase() || 'bachelor',
      experience: parseInt(bioData.experience) || 0,
      location: bioData.location || 'global',
      
      // Interests and Preferences
      interests: Array.isArray(bioData.interests) ? bioData.interests : [],
      hobbies: Array.isArray(bioData.hobbies) ? bioData.hobbies : [],
      workStyle: bioData.workStyle || 'balanced',
      workEnvironment: bioData.workEnvironment || 'office',
      
      // Skills and Abilities
      technicalSkills: Array.isArray(bioData.technicalSkills) ? bioData.technicalSkills : [],
      softSkills: Array.isArray(bioData.softSkills) ? bioData.softSkills : [],
      languages: Array.isArray(bioData.languages) ? bioData.languages : ['english'],
      
      // Career Preferences
      salaryExpectation: bioData.salaryExpectation || 'average',
      careerGoals: bioData.careerGoals || 'growth',
      workLifeBalance: bioData.workLifeBalance || 'important',
      travelWillingness: bioData.travelWillingness || 'moderate',
      
      // Personality Traits
      personalityType: bioData.personalityType || 'balanced',
      communicationStyle: bioData.communicationStyle || 'collaborative',
      problemSolvingStyle: bioData.problemSolvingStyle || 'analytical',
      leadershipStyle: bioData.leadershipStyle || 'supportive'
    };
  }

  /**
   * Apply Decision Tree Algorithm for career matching
   */
  applyDecisionTree(data) {
    const decisionNodes = [];
    
    // Education Level Decision Node
    if (data.education.includes('phd') || data.education.includes('doctorate')) {
      decisionNodes.push({ factor: 'education', weight: 0.3, value: 'advanced', careers: ['research', 'academia', 'consulting'] });
    } else if (data.education.includes('master')) {
      decisionNodes.push({ factor: 'education', weight: 0.25, value: 'graduate', careers: ['management', 'specialist', 'analyst'] });
    } else {
      decisionNodes.push({ factor: 'education', weight: 0.2, value: 'undergraduate', careers: ['developer', 'coordinator', 'associate'] });
    }
    
    // Technical Skills Decision Node
    const techSkillsCount = data.technicalSkills.length;
    if (techSkillsCount >= 5) {
      decisionNodes.push({ factor: 'technical', weight: 0.25, value: 'high', careers: ['software_engineer', 'data_scientist', 'devops_engineer'] });
    } else if (techSkillsCount >= 2) {
      decisionNodes.push({ factor: 'technical', weight: 0.2, value: 'medium', careers: ['business_analyst', 'product_manager', 'technical_writer'] });
    } else {
      decisionNodes.push({ factor: 'technical', weight: 0.15, value: 'low', careers: ['project_manager', 'sales', 'marketing'] });
    }
    
    // Interest-based Decision Node
    const interestCategories = this.categorizeInterests(data.interests);
    decisionNodes.push({ factor: 'interests', weight: 0.2, value: interestCategories, careers: this.getCareersByInterests(interestCategories) });
    
    // Experience Decision Node
    if (data.experience >= 5) {
      decisionNodes.push({ factor: 'experience', weight: 0.15, value: 'senior', careers: ['senior_roles', 'leadership', 'consulting'] });
    } else if (data.experience >= 2) {
      decisionNodes.push({ factor: 'experience', weight: 0.1, value: 'mid', careers: ['specialist_roles', 'team_lead', 'coordinator'] });
    } else {
      decisionNodes.push({ factor: 'experience', weight: 0.1, value: 'entry', careers: ['entry_level', 'associate', 'junior'] });
    }
    
    // Personality-based Decision Node
    const personalityMatch = this.matchPersonalityToCareers(data.personalityType);
    decisionNodes.push({ factor: 'personality', weight: 0.1, value: data.personalityType, careers: personalityMatch });
    
    return decisionNodes;
  }

  /**
   * Apply Adaptive Learning Algorithm
   */
  applyAdaptiveLearning(data, decisionTreeResults) {
    // Get user interaction history if available
    const userId = data.userId || 'anonymous';
    const userHistory = this.userInteractions.get(userId) || { preferences: [], feedback: [] };
    
    // Adjust weights based on user feedback and interactions
    const adaptedResults = decisionTreeResults.map(node => {
      let adjustedWeight = node.weight;
      
      // Increase weight for factors that user has shown preference for
      if (userHistory.preferences.includes(node.factor)) {
        adjustedWeight *= 1.2;
      }
      
      // Adjust based on feedback
      const feedback = userHistory.feedback.filter(f => f.factor === node.factor);
      if (feedback.length > 0) {
        const avgFeedback = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
        adjustedWeight *= (avgFeedback / 5); // Normalize to 0-1 scale
      }
      
      return { ...node, adjustedWeight };
    });
    
    // Apply industry trends adjustment
    const trendAdjustedResults = this.applyIndustryTrends(adaptedResults);
    
    return trendAdjustedResults;
  }

  /**
   * Generate career recommendations based on analysis
   */
  generateCareerRecommendations(analysisResults, bioData) {
    const careerScores = new Map();
    
    // Calculate scores for each career based on decision tree results
    analysisResults.forEach(node => {
      node.careers.forEach(careerCategory => {
        const careers = this.getCareersByCategory(careerCategory);
        careers.forEach(career => {
          const currentScore = careerScores.get(career.id) || 0;
          careerScores.set(career.id, currentScore + (node.adjustedWeight || node.weight));
        });
      });
    });
    
    // Convert to array and sort by score
    const rankedCareers = Array.from(careerScores.entries())
      .map(([careerId, score]) => {
        const career = this.careerDatabase.find(c => c.id === careerId);
        return {
          ...career,
          matchScore: Math.min(score * 100, 100), // Convert to percentage, cap at 100%
          reasons: this.generateMatchReasons(career, bioData, analysisResults)
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
    
    return rankedCareers;
  }

  /**
   * Generate personalized career roadmaps
   */
  async generateCareerRoadmaps(recommendations, bioData) {
    const roadmaps = [];
    
    for (const career of recommendations.slice(0, 3)) { // Top 3 careers
      // Get the enhanced roadmap stages from the career data
      const roadmapStages = career.roadmapStages || [];
      
      // Always add aptitude and interview preparation as the final stage
      const enhancedStages = [...roadmapStages];
      if (!enhancedStages.find(stage => stage.name.includes('Career Readiness'))) {
        enhancedStages.push({
          ...this.aptitudeGoals,
          id: enhancedStages.length + 1,
          estimatedDuration: '2-3 months',
          prerequisites: enhancedStages.length > 0 ? [enhancedStages[enhancedStages.length - 1].name] : []
        });
      }
      
      const roadmap = {
        careerId: career.id,
        careerTitle: career.title,
        category: career.category,
        description: career.description,
        timeframe: this.calculateTimeframe(career, bioData),
        stages: enhancedStages,
        totalDuration: this.calculateTotalDuration(enhancedStages),
        difficultyLevel: this.calculateDifficultyLevel(career, bioData),
        successProbability: this.calculateSuccessProbability(career, bioData),
        skills: this.getRequiredSkills(career, bioData),
        certifications: this.getRecommendedCertifications(career),
        networking: this.getNetworkingRecommendations(career),
        resources: this.getCareerResources(career),
        industryTrends: career.industryTrends || [],
        salaryRange: career.averageSalary,
        workEnvironment: career.workEnvironment || ['office', 'remote', 'hybrid']
      };
      
      roadmaps.push(roadmap);
    }
    
    return roadmaps;
  }

  calculateTotalDuration(stages) {
    if (!stages || stages.length === 0) return '6-12 months';
    
    // Extract duration numbers and calculate total
    let totalMonths = 0;
    stages.forEach(stage => {
      if (stage.estimatedDuration) {
        const duration = stage.estimatedDuration;
        const matches = duration.match(/(\d+)-?(\d+)?/);
        if (matches) {
          const min = parseInt(matches[1]);
          const max = matches[2] ? parseInt(matches[2]) : min;
          totalMonths += (min + max) / 2;
        }
      }
    });
    
    if (totalMonths === 0) return '6-12 months';
    
    const minTotal = Math.floor(totalMonths * 0.8);
    const maxTotal = Math.ceil(totalMonths * 1.2);
    
    return `${minTotal}-${maxTotal} months`;
  }

  calculateSuccessProbability(career, bioData) {
    let probability = 0.5; // Base probability
    
    // Adjust based on education match
    if (bioData.education && career.preferredEducation) {
      const educationLevel = bioData.education.toLowerCase();
      if (career.preferredEducation.some(edu => educationLevel.includes(edu))) {
        probability += 0.2;
      }
    }
    
    // Adjust based on skill match
    if (bioData.technicalSkills && career.requiredSkills) {
      const skillMatch = bioData.technicalSkills.filter(skill => 
        career.requiredSkills.some(reqSkill => 
          skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
          reqSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length;
      probability += (skillMatch / career.requiredSkills.length) * 0.3;
    }
    
    // Ensure probability is between 0 and 1
    return Math.min(Math.max(probability, 0.1), 0.95);
  }
  initializeCareerDatabase() {
    return [
      // Technology Careers
      {
        id: 'software_engineer',
        title: 'Software Engineer',
        category: 'technology',
        description: 'Design, develop, and maintain software applications and systems',
        averageSalary: { min: 70000, max: 150000, currency: 'USD' },
        growthRate: 'high',
        demandLevel: 'very_high',
        requiredSkills: ['programming', 'problem_solving', 'algorithms', 'software_design'],
        preferredEducation: ['bachelor', 'master'],
        workEnvironment: ['office', 'remote', 'hybrid'],
        industryTrends: ['ai_integration', 'cloud_computing', 'microservices']
      },
      {
        id: 'data_scientist',
        title: 'Data Scientist',
        category: 'technology',
        description: 'Analyze complex data to help organizations make informed decisions',
        averageSalary: { min: 80000, max: 160000, currency: 'USD' },
        growthRate: 'very_high',
        demandLevel: 'very_high',
        requiredSkills: ['statistics', 'machine_learning', 'python', 'data_visualization'],
        preferredEducation: ['bachelor', 'master', 'phd'],
        workEnvironment: ['office', 'remote', 'hybrid'],
        industryTrends: ['ai_ethics', 'automated_ml', 'edge_computing']
      },
      {
        id: 'cybersecurity_specialist',
        title: 'Cybersecurity Specialist',
        category: 'technology',
        description: 'Protect organizations from digital threats and security breaches',
        averageSalary: { min: 75000, max: 140000, currency: 'USD' },
        growthRate: 'very_high',
        demandLevel: 'very_high',
        requiredSkills: ['network_security', 'ethical_hacking', 'risk_assessment', 'compliance'],
        preferredEducation: ['bachelor', 'master'],
        workEnvironment: ['office', 'remote'],
        industryTrends: ['zero_trust', 'cloud_security', 'iot_security']
      },
      
      // Healthcare Careers
      {
        id: 'healthcare_data_analyst',
        title: 'Healthcare Data Analyst',
        category: 'healthcare',
        description: 'Analyze healthcare data to improve patient outcomes and operational efficiency',
        averageSalary: { min: 60000, max: 120000, currency: 'USD' },
        growthRate: 'high',
        demandLevel: 'high',
        requiredSkills: ['healthcare_knowledge', 'data_analysis', 'sql', 'healthcare_regulations'],
        preferredEducation: ['bachelor', 'master'],
        workEnvironment: ['office', 'hospital', 'remote'],
        industryTrends: ['telemedicine', 'ai_diagnostics', 'personalized_medicine']
      },
      
      // Finance Careers
      {
        id: 'financial_analyst',
        title: 'Financial Analyst',
        category: 'finance',
        description: 'Evaluate financial data and market trends to guide investment decisions',
        averageSalary: { min: 55000, max: 110000, currency: 'USD' },
        growthRate: 'moderate',
        demandLevel: 'high',
        requiredSkills: ['financial_modeling', 'excel', 'market_analysis', 'risk_assessment'],
        preferredEducation: ['bachelor', 'master'],
        workEnvironment: ['office', 'hybrid'],
        industryTrends: ['fintech', 'cryptocurrency', 'sustainable_investing']
      },
      
      // Creative Careers
      {
        id: 'ux_designer',
        title: 'UX/UI Designer',
        category: 'creative',
        description: 'Design user-friendly interfaces and experiences for digital products',
        averageSalary: { min: 60000, max: 130000, currency: 'USD' },
        growthRate: 'high',
        demandLevel: 'high',
        requiredSkills: ['design_thinking', 'prototyping', 'user_research', 'visual_design'],
        preferredEducation: ['bachelor', 'portfolio'],
        workEnvironment: ['office', 'remote', 'hybrid'],
        industryTrends: ['voice_ui', 'ar_vr_design', 'accessibility']
      },
      
      // Business Careers
      {
        id: 'product_manager',
        title: 'Product Manager',
        category: 'business',
        description: 'Guide product development from conception to launch and beyond',
        averageSalary: { min: 70000, max: 150000, currency: 'USD' },
        growthRate: 'high',
        demandLevel: 'high',
        requiredSkills: ['product_strategy', 'market_research', 'project_management', 'communication'],
        preferredEducation: ['bachelor', 'master'],
        workEnvironment: ['office', 'hybrid'],
        industryTrends: ['agile_methodology', 'data_driven_decisions', 'customer_centricity']
      },
      
      // Marketing Careers
      {
        id: 'digital_marketing_specialist',
        title: 'Digital Marketing Specialist',
        category: 'marketing',
        description: 'Develop and execute digital marketing strategies across various channels',
        averageSalary: { min: 45000, max: 90000, currency: 'USD' },
        growthRate: 'high',
        demandLevel: 'high',
        requiredSkills: ['seo', 'social_media', 'content_marketing', 'analytics'],
        preferredEducation: ['bachelor'],
        workEnvironment: ['office', 'remote', 'hybrid'],
        industryTrends: ['influencer_marketing', 'ai_personalization', 'privacy_regulations']
      }
    ];
  }

  /**
   * Initialize skills database
   */
  initializeSkillsDatabase() {
    return {
      technical: [
        'programming', 'python', 'javascript', 'java', 'sql', 'machine_learning',
        'data_analysis', 'cloud_computing', 'cybersecurity', 'web_development',
        'mobile_development', 'devops', 'ai', 'blockchain'
      ],
      business: [
        'project_management', 'business_analysis', 'strategic_planning',
        'financial_analysis', 'market_research', 'product_management',
        'operations', 'consulting', 'sales', 'negotiation'
      ],
      creative: [
        'graphic_design', 'ux_design', 'content_creation', 'video_editing',
        'photography', 'writing', 'branding', 'illustration', 'animation'
      ],
      soft: [
        'communication', 'leadership', 'teamwork', 'problem_solving',
        'critical_thinking', 'adaptability', 'time_management', 'creativity',
        'emotional_intelligence', 'conflict_resolution'
      ]
    };
  }

  /**
   * Initialize industry trends
   */
  initializeIndustryTrends() {
    return {
      technology: {
        trending: ['ai', 'machine_learning', 'cloud_computing', 'cybersecurity', 'blockchain'],
        growth_rate: 1.3,
        demand_multiplier: 1.2
      },
      healthcare: {
        trending: ['telemedicine', 'health_informatics', 'biotechnology', 'mental_health'],
        growth_rate: 1.2,
        demand_multiplier: 1.15
      },
      finance: {
        trending: ['fintech', 'cryptocurrency', 'robo_advisors', 'sustainable_finance'],
        growth_rate: 1.1,
        demand_multiplier: 1.1
      },
      creative: {
        trending: ['digital_content', 'ux_design', 'virtual_reality', 'brand_experience'],
        growth_rate: 1.15,
        demand_multiplier: 1.1
      }
    };
  }

  /**
   * Helper methods
   */
  categorizeInterests(interests) {
    const categories = {
      technology: ['programming', 'computers', 'gadgets', 'innovation', 'automation'],
      creative: ['art', 'design', 'music', 'writing', 'photography', 'creativity'],
      business: ['entrepreneurship', 'finance', 'management', 'strategy', 'economics'],
      science: ['research', 'analysis', 'experimentation', 'discovery', 'mathematics'],
      social: ['helping_others', 'community', 'education', 'healthcare', 'social_impact']
    };
    
    const matchedCategories = [];
    for (const [category, keywords] of Object.entries(categories)) {
      if (interests.some(interest => keywords.some(keyword => 
        interest.toLowerCase().includes(keyword.toLowerCase())
      ))) {
        matchedCategories.push(category);
      }
    }
    
    return matchedCategories.length > 0 ? matchedCategories : ['general'];
  }

  getCareersByInterests(interestCategories) {
    const careerMapping = {
      technology: ['software_engineer', 'data_scientist', 'cybersecurity_specialist'],
      creative: ['ux_designer', 'digital_marketing_specialist'],
      business: ['product_manager', 'financial_analyst'],
      science: ['data_scientist', 'healthcare_data_analyst'],
      social: ['healthcare_data_analyst', 'product_manager']
    };
    
    const careers = [];
    interestCategories.forEach(category => {
      if (careerMapping[category]) {
        careers.push(...careerMapping[category]);
      }
    });
    
    return careers.length > 0 ? careers : ['general'];
  }

  matchPersonalityToCareers(personalityType) {
    const personalityMapping = {
      analytical: ['data_scientist', 'financial_analyst', 'cybersecurity_specialist'],
      creative: ['ux_designer', 'digital_marketing_specialist'],
      leadership: ['product_manager', 'project_manager'],
      collaborative: ['software_engineer', 'ux_designer', 'product_manager'],
      independent: ['software_engineer', 'data_scientist', 'cybersecurity_specialist']
    };
    
    return personalityMapping[personalityType] || ['general'];
  }

  getCareersByCategory(category) {
    const categoryMapping = {
      research: this.careerDatabase.filter(c => c.requiredSkills.includes('research')),
      academia: this.careerDatabase.filter(c => c.preferredEducation.includes('phd')),
      management: this.careerDatabase.filter(c => c.requiredSkills.includes('leadership')),
      developer: this.careerDatabase.filter(c => c.category === 'technology'),
      analyst: this.careerDatabase.filter(c => c.title.toLowerCase().includes('analyst')),
      entry_level: this.careerDatabase.filter(c => c.averageSalary.min < 60000),
      senior_roles: this.careerDatabase.filter(c => c.averageSalary.min > 80000)
    };
    
    return categoryMapping[category] || this.careerDatabase;
  }

  generateMatchReasons(career, bioData, analysisResults) {
    const reasons = [];
    
    // Check skill matches
    const skillMatches = career.requiredSkills.filter(skill => 
      bioData.technicalSkills.includes(skill) || bioData.softSkills.includes(skill)
    );
    if (skillMatches.length > 0) {
      reasons.push(`Your skills in ${skillMatches.join(', ')} align well with this role`);
    }
    
    // Check education match
    if (career.preferredEducation.includes(bioData.education)) {
      reasons.push(`Your ${bioData.education} degree meets the educational requirements`);
    }
    
    // Check interest alignment
    const interestCategories = this.categorizeInterests(bioData.interests);
    if (interestCategories.includes(career.category)) {
      reasons.push(`This career aligns with your interests in ${career.category}`);
    }
    
    // Check growth potential
    if (career.growthRate === 'high' || career.growthRate === 'very_high') {
      reasons.push(`High growth potential in this field`);
    }
    
    return reasons;
  }

  generatePersonalityProfile(bioData) {
    return {
      type: bioData.personalityType,
      strengths: this.identifyStrengths(bioData),
      workStyle: bioData.workStyle,
      communicationPreference: bioData.communicationStyle,
      problemSolvingApproach: bioData.problemSolvingStyle
    };
  }

  assessCurrentSkills(bioData) {
    const allSkills = [...bioData.technicalSkills, ...bioData.softSkills];
    return {
      technical: bioData.technicalSkills,
      soft: bioData.softSkills,
      total: allSkills.length,
      categories: this.categorizeSkills(allSkills),
      recommendations: this.getSkillRecommendations(allSkills)
    };
  }

  identifyStrengths(bioData) {
    const strengths = [];
    
    if (bioData.technicalSkills.length >= 3) {
      strengths.push('Strong technical foundation');
    }
    
    if (bioData.softSkills.includes('leadership')) {
      strengths.push('Leadership potential');
    }
    
    if (bioData.softSkills.includes('communication')) {
      strengths.push('Excellent communication skills');
    }
    
    if (bioData.experience >= 3) {
      strengths.push('Solid professional experience');
    }
    
    return strengths;
  }

  categorizeSkills(skills) {
    const categories = { technical: 0, business: 0, creative: 0, soft: 0 };
    
    skills.forEach(skill => {
      if (this.skillsDatabase.technical.includes(skill)) categories.technical++;
      else if (this.skillsDatabase.business.includes(skill)) categories.business++;
      else if (this.skillsDatabase.creative.includes(skill)) categories.creative++;
      else if (this.skillsDatabase.soft.includes(skill)) categories.soft++;
    });
    
    return categories;
  }

  getSkillRecommendations(currentSkills) {
    // Recommend skills based on current skill gaps and industry trends
    const recommendations = [];
    
    if (currentSkills.filter(s => this.skillsDatabase.technical.includes(s)).length < 3) {
      recommendations.push('Consider developing more technical skills');
    }
    
    if (!currentSkills.includes('communication')) {
      recommendations.push('Communication skills are valuable in all careers');
    }
    
    return recommendations;
  }

  calculateConfidenceScore(bioData, recommendations) {
    let score = 0;
    
    // More complete bio data = higher confidence
    const completeness = this.calculateDataCompleteness(bioData);
    score += completeness * 0.4;
    
    // Clear skill matches = higher confidence
    if (recommendations.length > 0 && recommendations[0].matchScore > 70) {
      score += 0.3;
    }
    
    // Experience level affects confidence
    if (bioData.experience >= 2) {
      score += 0.2;
    }
    
    // Education level affects confidence
    if (bioData.education !== 'high_school') {
      score += 0.1;
    }
    
    return Math.min(score * 100, 95); // Cap at 95%
  }

  calculateDataCompleteness(bioData) {
    const fields = [
      'age', 'education', 'interests', 'technicalSkills', 'softSkills',
      'workStyle', 'careerGoals', 'personalityType'
    ];
    
    let completedFields = 0;
    fields.forEach(field => {
      if (bioData[field] && (Array.isArray(bioData[field]) ? bioData[field].length > 0 : true)) {
        completedFields++;
      }
    });
    
    return completedFields / fields.length;
  }

  async generateRoadmapPhases(career, bioData) {
    const phases = [];
    const timeframe = this.calculateTimeframe(career, bioData);
    
    // Phase 1: Foundation (0-3 months)
    phases.push({
      name: 'Foundation Building',
      duration: '0-3 months',
      description: 'Build fundamental skills and knowledge',
      tasks: this.getFoundationTasks(career, bioData),
      skills: this.getFoundationSkills(career),
      resources: this.getPhaseResources(career, 'foundation')
    });
    
    // Phase 2: Skill Development (3-9 months)
    phases.push({
      name: 'Skill Development',
      duration: '3-9 months',
      description: 'Develop specialized skills and gain practical experience',
      tasks: this.getSkillDevelopmentTasks(career, bioData),
      skills: this.getSpecializedSkills(career),
      resources: this.getPhaseResources(career, 'development')
    });
    
    // Phase 3: Experience & Portfolio (9-18 months)
    phases.push({
      name: 'Experience & Portfolio',
      duration: '9-18 months',
      description: 'Build portfolio and gain real-world experience',
      tasks: this.getExperienceTasks(career, bioData),
      skills: this.getAdvancedSkills(career),
      resources: this.getPhaseResources(career, 'experience')
    });
    
    // Phase 4: Career Launch (18+ months)
    phases.push({
      name: 'Career Launch',
      duration: '18+ months',
      description: 'Launch your career and continue growing',
      tasks: this.getCareerLaunchTasks(career, bioData),
      skills: this.getLeadershipSkills(career),
      resources: this.getPhaseResources(career, 'launch')
    });
    
    return phases;
  }

  calculateTimeframe(career, bioData) {
    let baseTimeframe = 18; // months
    
    // Adjust based on current experience
    if (bioData.experience >= 2) {
      baseTimeframe -= 6;
    }
    
    // Adjust based on education
    if (bioData.education.includes('master') || bioData.education.includes('phd')) {
      baseTimeframe -= 3;
    }
    
    // Adjust based on relevant skills
    const relevantSkills = career.requiredSkills.filter(skill => 
      bioData.technicalSkills.includes(skill) || bioData.softSkills.includes(skill)
    );
    baseTimeframe -= relevantSkills.length * 2;
    
    return Math.max(baseTimeframe, 6); // Minimum 6 months
  }

  getFoundationTasks(career, bioData) {
    const tasks = [
      'Complete industry overview research',
      'Identify key skills and requirements',
      'Set up learning environment and tools',
      'Join relevant professional communities'
    ];
    
    // Add career-specific tasks
    if (career.category === 'technology') {
      tasks.push('Set up development environment', 'Learn version control (Git)');
    } else if (career.category === 'business') {
      tasks.push('Understand business fundamentals', 'Learn industry terminology');
    }
    
    return tasks;
  }

  getSkillDevelopmentTasks(career, bioData) {
    return [
      'Complete relevant online courses',
      'Practice with hands-on projects',
      'Attend workshops and webinars',
      'Find a mentor in the field',
      'Start building a professional network'
    ];
  }

  getExperienceTasks(career, bioData) {
    return [
      'Build a portfolio of projects',
      'Contribute to open source projects',
      'Seek internship or volunteer opportunities',
      'Attend industry conferences',
      'Start applying for entry-level positions'
    ];
  }

  getCareerLaunchTasks(career, bioData) {
    return [
      'Optimize resume and LinkedIn profile',
      'Prepare for technical interviews',
      'Network with industry professionals',
      'Consider specialization areas',
      'Plan for continuous learning'
    ];
  }

  getFoundationSkills(career) {
    return career.requiredSkills.slice(0, 2);
  }

  getSpecializedSkills(career) {
    return career.requiredSkills.slice(2, 4);
  }

  getAdvancedSkills(career) {
    return career.requiredSkills.slice(4);
  }

  getLeadershipSkills(career) {
    return ['leadership', 'mentoring', 'strategic_thinking', 'team_management'];
  }

  getPhaseResources(career, phase) {
    // Return relevant learning resources for each phase
    const resources = {
      foundation: [
        { type: 'course', name: 'Industry Fundamentals', provider: 'Coursera' },
        { type: 'book', name: 'Career Guide', author: 'Industry Expert' }
      ],
      development: [
        { type: 'course', name: 'Advanced Skills', provider: 'edX' },
        { type: 'practice', name: 'Hands-on Projects', provider: 'GitHub' }
      ],
      experience: [
        { type: 'platform', name: 'Portfolio Building', provider: 'Personal Website' },
        { type: 'community', name: 'Professional Network', provider: 'LinkedIn' }
      ],
      launch: [
        { type: 'guide', name: 'Interview Preparation', provider: 'Career Center' },
        { type: 'tool', name: 'Job Search', provider: 'Job Boards' }
      ]
    };
    
    return resources[phase] || [];
  }

  getRequiredSkills(career, bioData) {
    const currentSkills = [...bioData.technicalSkills, ...bioData.softSkills];
    const requiredSkills = career.requiredSkills;
    
    return {
      current: currentSkills.filter(skill => requiredSkills.includes(skill)),
      missing: requiredSkills.filter(skill => !currentSkills.includes(skill)),
      recommended: this.getRecommendedSkills(career, bioData)
    };
  }

  getRecommendedSkills(career, bioData) {
    // Recommend additional skills based on industry trends
    const trendingSkills = this.industryTrends[career.category]?.trending || [];
    return trendingSkills.slice(0, 3);
  }

  getRecommendedCertifications(career) {
    const certifications = {
      software_engineer: ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure'],
      data_scientist: ['Google Data Analytics', 'IBM Data Science', 'Microsoft Azure Data Scientist'],
      cybersecurity_specialist: ['CISSP', 'CEH', 'CompTIA Security+'],
      ux_designer: ['Google UX Design', 'Adobe Certified Expert', 'HFI Certification'],
      product_manager: ['Product Management Certificate', 'Scrum Master', 'Google Analytics'],
      financial_analyst: ['CFA', 'FRM', 'Excel Expert'],
      digital_marketing_specialist: ['Google Ads', 'Facebook Blueprint', 'HubSpot Content Marketing']
    };
    
    return certifications[career.id] || ['Industry-specific certifications'];
  }

  getRecommendedProjects(career, bioData) {
    const projects = {
      software_engineer: [
        'Build a full-stack web application',
        'Contribute to open source projects',
        'Create a mobile app'
      ],
      data_scientist: [
        'Complete a data analysis project',
        'Build a machine learning model',
        'Create data visualizations'
      ],
      ux_designer: [
        'Design a mobile app interface',
        'Conduct user research study',
        'Create a design system'
      ]
    };
    
    return projects[career.id] || ['Industry-relevant projects'];
  }

  getNetworkingRecommendations(career) {
    return [
      'Join professional associations',
      'Attend industry meetups and conferences',
      'Connect with professionals on LinkedIn',
      'Participate in online communities',
      'Find a mentor in the field'
    ];
  }

  getCareerResources(career) {
    return [
      { type: 'website', name: 'Industry News', url: 'industry-specific-site.com' },
      { type: 'podcast', name: 'Career Insights', description: 'Weekly industry updates' },
      { type: 'newsletter', name: 'Professional Updates', description: 'Monthly career tips' },
      { type: 'community', name: 'Professional Forum', description: 'Connect with peers' }
    ];
  }

  getIndustryInsights(recommendations) {
    const insights = [];
    
    recommendations.forEach(career => {
      const trend = this.industryTrends[career.category];
      if (trend) {
        insights.push({
          career: career.title,
          growthRate: trend.growth_rate,
          trendingSkills: trend.trending,
          outlook: trend.growth_rate > 1.2 ? 'Excellent' : trend.growth_rate > 1.1 ? 'Good' : 'Stable'
        });
      }
    });
    
    return insights;
  }

  generateNextSteps(topCareer, bioData) {
    const nextSteps = [];
    
    // Immediate actions (next 30 days)
    nextSteps.push({
      timeframe: 'Next 30 days',
      priority: 'high',
      actions: [
        `Research ${topCareer.title} role requirements`,
        'Assess current skill gaps',
        'Create a learning plan',
        'Join relevant online communities'
      ]
    });
    
    // Short-term goals (3 months)
    nextSteps.push({
      timeframe: '3 months',
      priority: 'medium',
      actions: [
        'Complete foundational courses',
        'Start building a portfolio',
        'Network with professionals',
        'Gain hands-on experience'
      ]
    });
    
    // Long-term goals (6-12 months)
    nextSteps.push({
      timeframe: '6-12 months',
      priority: 'medium',
      actions: [
        'Apply for relevant positions',
        'Complete advanced certifications',
        'Build a strong professional network',
        'Consider specialization areas'
      ]
    });
    
    return nextSteps;
  }

  applyIndustryTrends(analysisResults) {
    return analysisResults.map(result => {
      const careers = result.careers.map(careerCategory => {
        const careersInCategory = this.getCareersByCategory(careerCategory);
        return careersInCategory.map(career => {
          const trend = this.industryTrends[career.category];
          if (trend) {
            return {
              ...career,
              trendAdjustedWeight: result.adjustedWeight * trend.demand_multiplier
            };
          }
          return career;
        });
      }).flat();
      
      return {
        ...result,
        careers: careers
      };
    });
  }

  /**
   * Track user feedback for adaptive learning
   */
  trackUserFeedback(userId, feedback) {
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, { preferences: [], feedback: [] });
    }
    
    const userHistory = this.userInteractions.get(userId);
    userHistory.feedback.push({
      ...feedback,
      timestamp: new Date()
    });
    
    this.userInteractions.set(userId, userHistory);
  }

  /**
   * Update user preferences for adaptive learning
   */
  updateUserPreferences(userId, preferences) {
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, { preferences: [], feedback: [] });
    }
    
    const userHistory = this.userInteractions.get(userId);
    userHistory.preferences = [...new Set([...userHistory.preferences, ...preferences])];
    
    this.userInteractions.set(userId, userHistory);
  }

  /**
   * Additional helper methods for the API routes
   */
  
  calculateDifficultyLevel(career, bioData) {
    let difficulty = 0;
    
    // Education requirements
    if (career.preferredEducation.includes('phd')) difficulty += 3;
    else if (career.preferredEducation.includes('master')) difficulty += 2;
    else difficulty += 1;
    
    // Skill requirements
    difficulty += career.requiredSkills.length * 0.5;
    
    // Experience gap
    const experienceGap = Math.max(0, 3 - (bioData.experience || 0));
    difficulty += experienceGap * 0.5;
    
    // Normalize to 1-5 scale
    const normalizedDifficulty = Math.min(Math.max(Math.round(difficulty), 1), 5);
    
    const levels = ['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'];
    return levels[normalizedDifficulty - 1];
  }
  
  calculateSuccessProbability(career, bioData) {
    let probability = 0.5; // Base 50%
    
    // Education match
    if (career.preferredEducation.includes(bioData.education)) {
      probability += 0.2;
    }
    
    // Skill match
    const skillMatches = career.requiredSkills.filter(skill => 
      bioData.technicalSkills?.includes(skill) || bioData.softSkills?.includes(skill)
    ).length;
    probability += (skillMatches / career.requiredSkills.length) * 0.3;
    
    // Interest alignment
    const interestCategories = this.categorizeInterests(bioData.interests || []);
    if (interestCategories.includes(career.category)) {
      probability += 0.15;
    }
    
    // Experience relevance
    if (bioData.experience >= 2) {
      probability += 0.1;
    }
    
    return Math.min(Math.round(probability * 100), 95);
  }
  
  calculateMatchScore(career, bioData) {
    let score = 0;
    
    // Skill matching (40%)
    const skillMatches = career.requiredSkills.filter(skill => 
      bioData.technicalSkills?.includes(skill) || bioData.softSkills?.includes(skill)
    ).length;
    score += (skillMatches / career.requiredSkills.length) * 40;
    
    // Education matching (25%)
    if (career.preferredEducation.includes(bioData.education)) {
      score += 25;
    } else if (bioData.education && career.preferredEducation.length > 0) {
      score += 10; // Partial credit
    }
    
    // Interest alignment (20%)
    const interestCategories = this.categorizeInterests(bioData.interests || []);
    if (interestCategories.includes(career.category)) {
      score += 20;
    }
    
    // Experience relevance (15%)
    if (bioData.experience >= 2) {
      score += 15;
    } else if (bioData.experience >= 1) {
      score += 8;
    }
    
    return Math.round(score);
  }
  
  getCareerPros(career) {
    const pros = [];
    
    if (career.growthRate === 'very_high' || career.growthRate === 'high') {
      pros.push('High growth potential');
    }
    
    if (career.demandLevel === 'very_high' || career.demandLevel === 'high') {
      pros.push('Strong job market demand');
    }
    
    if (career.averageSalary.max > 100000) {
      pros.push('Excellent earning potential');
    }
    
    if (career.workEnvironment.includes('remote')) {
      pros.push('Remote work opportunities');
    }
    
    if (career.category === 'technology') {
      pros.push('Cutting-edge technology exposure');
    }
    
    return pros;
  }
  
  getCareerCons(career) {
    const cons = [];
    
    if (career.requiredSkills.length > 5) {
      cons.push('Requires many technical skills');
    }
    
    if (career.preferredEducation.includes('master') || career.preferredEducation.includes('phd')) {
      cons.push('Advanced education typically required');
    }
    
    if (career.category === 'technology') {
      cons.push('Rapidly changing technology landscape');
    }
    
    if (career.averageSalary.min < 50000) {
      cons.push('Lower starting salaries');
    }
    
    return cons;
  }
  
  generateSkillLearningPath(recommendations, timeframe = '6 months') {
    const allSkills = [];
    const skillPriority = new Map();
    
    // Collect all missing skills with priority
    recommendations.forEach(rec => {
      rec.missingSkills.forEach(skill => {
        if (!allSkills.includes(skill)) {
          allSkills.push(skill);
        }
        
        const currentPriority = skillPriority.get(skill) || 0;
        const newPriority = rec.priority === 'high' ? 3 : 2;
        skillPriority.set(skill, Math.max(currentPriority, newPriority));
      });
    });
    
    // Sort skills by priority
    const sortedSkills = allSkills.sort((a, b) => 
      (skillPriority.get(b) || 0) - (skillPriority.get(a) || 0)
    );
    
    // Create learning phases
    const phases = [];
    const skillsPerPhase = Math.ceil(sortedSkills.length / 3);
    
    for (let i = 0; i < 3; i++) {
      const phaseSkills = sortedSkills.slice(i * skillsPerPhase, (i + 1) * skillsPerPhase);
      if (phaseSkills.length > 0) {
        phases.push({
          phase: i + 1,
          name: `Phase ${i + 1}`,
          duration: `${Math.ceil(parseInt(timeframe) / 3)} months`,
          skills: phaseSkills,
          focus: i === 0 ? 'Foundation' : i === 1 ? 'Specialization' : 'Advanced'
        });
      }
    }
    
    return {
      totalTimeframe: timeframe,
      phases,
      totalSkills: sortedSkills.length,
      prioritySkills: sortedSkills.filter(skill => skillPriority.get(skill) >= 3)
    };
  }
}

module.exports = CareerRecommendationEngine;