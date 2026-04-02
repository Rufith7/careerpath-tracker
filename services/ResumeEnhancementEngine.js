/**
 * AI Resume & CV Enhancement Engine
 * NLP + Optimization Algorithm for resume improvement
 * Features: ATS optimization, keyword matching, structure improvement
 */

class ResumeEnhancementEngine {
  constructor() {
    this.industryKeywords = this.initializeIndustryKeywords();
    this.atsKeywords = this.initializeATSKeywords();
    this.actionVerbs = this.initializeActionVerbs();
    this.skillsDatabase = this.initializeSkillsDatabase();
  }

  initializeIndustryKeywords() {
    return {
      'IT': {
        'frontend': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SASS', 'Bootstrap', 'Tailwind', 'Responsive Design', 'UI/UX', 'Webpack', 'npm', 'Git'],
        'backend': ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby on Rails', 'API', 'REST', 'GraphQL', 'Microservices'],
        'database': ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQL', 'NoSQL', 'Database Design', 'Data Modeling'],
        'devops': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Linux', 'Nginx'],
        'mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Xamarin', 'Mobile Development'],
        'general': ['Agile', 'Scrum', 'Problem Solving', 'Team Collaboration', 'Code Review', 'Testing', 'Debugging', 'Performance Optimization']
      },
      'DataScience': {
        'programming': ['Python', 'R', 'SQL', 'Scala', 'Julia', 'MATLAB', 'SAS'],
        'ml': ['Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost', 'Random Forest', 'SVM'],
        'analytics': ['Data Analysis', 'Statistical Analysis', 'Predictive Modeling', 'A/B Testing', 'Hypothesis Testing', 'Regression Analysis'],
        'tools': ['Jupyter', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'Kafka'],
        'domains': ['Computer Vision', 'NLP', 'Time Series', 'Recommendation Systems', 'Anomaly Detection', 'Feature Engineering']
      },
      'Finance': {
        'analysis': ['Financial Analysis', 'Risk Management', 'Portfolio Management', 'Investment Analysis', 'Credit Analysis', 'Valuation'],
        'tools': ['Excel', 'VBA', 'Bloomberg Terminal', 'Reuters', 'MATLAB', 'R', 'Python', 'SQL', 'Tableau'],
        'regulations': ['SOX', 'GAAP', 'IFRS', 'Basel III', 'Dodd-Frank', 'MiFID II', 'Compliance'],
        'products': ['Derivatives', 'Fixed Income', 'Equities', 'FX', 'Commodities', 'Structured Products']
      },
      'Healthcare': {
        'clinical': ['Patient Care', 'Clinical Research', 'Medical Records', 'HIPAA', 'EMR', 'EHR', 'Clinical Trials'],
        'technical': ['Medical Devices', 'Healthcare IT', 'Telemedicine', 'Health Informatics', 'Medical Imaging'],
        'regulatory': ['FDA', 'GCP', 'ICH', 'Clinical Data Management', 'Regulatory Affairs']
      }
    };
  }

  initializeATSKeywords() {
    return [
      'achieved', 'managed', 'led', 'developed', 'implemented', 'created', 'designed', 'improved',
      'increased', 'decreased', 'optimized', 'streamlined', 'collaborated', 'coordinated',
      'analyzed', 'evaluated', 'researched', 'trained', 'mentored', 'supervised'
    ];
  }

  initializeActionVerbs() {
    return {
      'leadership': ['Led', 'Managed', 'Directed', 'Supervised', 'Coordinated', 'Guided', 'Mentored', 'Trained'],
      'achievement': ['Achieved', 'Accomplished', 'Delivered', 'Exceeded', 'Improved', 'Increased', 'Optimized', 'Enhanced'],
      'technical': ['Developed', 'Implemented', 'Designed', 'Built', 'Created', 'Programmed', 'Configured', 'Deployed'],
      'analysis': ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Identified', 'Determined', 'Measured'],
      'collaboration': ['Collaborated', 'Partnered', 'Worked', 'Communicated', 'Presented', 'Facilitated', 'Supported', 'Assisted']
    };
  }

  initializeSkillsDatabase() {
    return {
      'technical': new Set(['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git']),
      'soft': new Set(['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management', 'Critical Thinking']),
      'certifications': new Set(['AWS Certified', 'Google Cloud', 'Microsoft Azure', 'PMP', 'Scrum Master', 'Six Sigma'])
    };
  }

  // Main resume enhancement function
  async enhanceResume(resumeData, targetRole, domain) {
    try {
      const analysis = this.analyzeResume(resumeData);
      const keywords = this.extractRelevantKeywords(targetRole, domain);
      const optimizations = this.generateOptimizations(analysis, keywords, targetRole);
      const enhancedSections = this.enhanceResumeSections(resumeData, optimizations);
      const atsScore = this.calculateATSScore(enhancedSections, keywords);

      return {
        success: true,
        originalResume: resumeData,
        enhancedResume: enhancedSections,
        analysis: analysis,
        optimizations: optimizations,
        atsScore: atsScore,
        recommendations: this.generateRecommendations(analysis, atsScore),
        keywords: keywords
      };
    } catch (error) {
      console.error('Resume enhancement error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Analyze existing resume
  analyzeResume(resumeData) {
    const analysis = {
      wordCount: 0,
      sectionCount: 0,
      skillsFound: [],
      actionVerbsUsed: [],
      quantifiableAchievements: 0,
      keywordDensity: {},
      structureScore: 0,
      contentScore: 0
    };

    // Analyze each section
    Object.keys(resumeData).forEach(section => {
      if (typeof resumeData[section] === 'string') {
        const text = resumeData[section].toLowerCase();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        analysis.wordCount += words.length;
        analysis.sectionCount++;

        // Find action verbs
        Object.values(this.actionVerbs).flat().forEach(verb => {
          if (text.includes(verb.toLowerCase())) {
            analysis.actionVerbsUsed.push(verb);
          }
        });

        // Find quantifiable achievements (numbers, percentages)
        const quantifiableMatches = text.match(/\d+%|\d+\+|\$\d+|\d+x|increased by \d+|reduced by \d+/g);
        if (quantifiableMatches) {
          analysis.quantifiableAchievements += quantifiableMatches.length;
        }

        // Find technical skills
        Object.values(this.skillsDatabase).forEach(skillSet => {
          skillSet.forEach(skill => {
            if (text.includes(skill.toLowerCase())) {
              analysis.skillsFound.push(skill);
            }
          });
        });
      }
    });

    // Calculate scores
    analysis.structureScore = this.calculateStructureScore(resumeData);
    analysis.contentScore = this.calculateContentScore(analysis);

    return analysis;
  }

  // Extract relevant keywords for target role
  extractRelevantKeywords(targetRole, domain) {
    const keywords = {
      required: [],
      preferred: [],
      industry: []
    };

    // Get industry-specific keywords
    if (this.industryKeywords[domain]) {
      Object.values(this.industryKeywords[domain]).forEach(keywordSet => {
        keywords.industry.push(...keywordSet);
      });
    }

    // Role-specific keywords based on common job descriptions
    const roleKeywords = this.getRoleSpecificKeywords(targetRole, domain);
    keywords.required = roleKeywords.required;
    keywords.preferred = roleKeywords.preferred;

    return keywords;
  }

  getRoleSpecificKeywords(role, domain) {
    const roleMap = {
      'Software Engineer': {
        required: ['Programming', 'Software Development', 'Debugging', 'Testing', 'Git', 'Agile'],
        preferred: ['Full Stack', 'API Development', 'Database Design', 'Cloud Computing']
      },
      'Data Scientist': {
        required: ['Machine Learning', 'Python', 'Statistics', 'Data Analysis', 'SQL'],
        preferred: ['Deep Learning', 'Big Data', 'Visualization', 'A/B Testing']
      },
      'Product Manager': {
        required: ['Product Management', 'Roadmap', 'Stakeholder Management', 'Analytics'],
        preferred: ['Agile', 'User Research', 'A/B Testing', 'Go-to-Market']
      },
      'Financial Analyst': {
        required: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Reporting'],
        preferred: ['VBA', 'SQL', 'Tableau', 'Risk Management']
      }
    };

    return roleMap[role] || { required: [], preferred: [] };
  }

  // Generate optimization suggestions
  generateOptimizations(analysis, keywords, targetRole) {
    const optimizations = {
      structure: [],
      content: [],
      keywords: [],
      ats: []
    };

    // Structure optimizations
    if (analysis.sectionCount < 4) {
      optimizations.structure.push('Add more sections (Skills, Projects, Certifications)');
    }
    if (analysis.wordCount < 200) {
      optimizations.structure.push('Expand content - resume appears too brief');
    }
    if (analysis.wordCount > 800) {
      optimizations.structure.push('Condense content - resume may be too lengthy');
    }

    // Content optimizations
    if (analysis.actionVerbsUsed.length < 5) {
      optimizations.content.push('Use more action verbs to start bullet points');
    }
    if (analysis.quantifiableAchievements < 3) {
      optimizations.content.push('Add more quantifiable achievements with numbers/percentages');
    }

    // Keyword optimizations
    const missingKeywords = keywords.required.filter(keyword => 
      !analysis.skillsFound.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    if (missingKeywords.length > 0) {
      optimizations.keywords.push(`Add missing required keywords: ${missingKeywords.join(', ')}`);
    }

    // ATS optimizations
    optimizations.ats.push('Use standard section headers (Experience, Education, Skills)');
    optimizations.ats.push('Avoid tables, graphics, and complex formatting');
    optimizations.ats.push('Include keywords naturally throughout the resume');

    return optimizations;
  }

  // Enhance resume sections
  enhanceResumeSections(resumeData, optimizations) {
    const enhanced = { ...resumeData };

    // Enhance summary/objective
    if (enhanced.summary) {
      enhanced.summary = this.enhanceSummary(enhanced.summary, optimizations);
    }

    // Enhance experience section
    if (enhanced.experience) {
      enhanced.experience = this.enhanceExperience(enhanced.experience);
    }

    // Enhance skills section
    if (enhanced.skills) {
      enhanced.skills = this.enhanceSkills(enhanced.skills);
    }

    // Add missing sections
    if (!enhanced.skills) {
      enhanced.skills = this.generateSkillsSection(resumeData);
    }

    return enhanced;
  }

  enhanceSummary(summary, optimizations) {
    let enhanced = summary;
    
    // Add action verbs if missing
    if (!this.actionVerbs.achievement.some(verb => summary.includes(verb))) {
      enhanced = enhanced.replace(/^/, 'Accomplished ');
    }

    // Add quantifiable elements if missing
    if (!/\d+/.test(enhanced)) {
      enhanced += ' with proven track record of delivering results.';
    }

    return enhanced;
  }

  enhanceExperience(experience) {
    if (Array.isArray(experience)) {
      return experience.map(job => ({
        ...job,
        description: this.enhanceJobDescription(job.description || '')
      }));
    }
    return this.enhanceJobDescription(experience);
  }

  enhanceJobDescription(description) {
    let enhanced = description;
    
    // Ensure bullet points start with action verbs
    const lines = enhanced.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
        // Check if starts with action verb
        const startsWithActionVerb = Object.values(this.actionVerbs).flat()
          .some(verb => trimmed.toLowerCase().startsWith(verb.toLowerCase()));
        
        if (!startsWithActionVerb) {
          return `• Developed ${trimmed.toLowerCase()}`;
        }
        return `• ${trimmed}`;
      }
      return line;
    });

    return lines.join('\n');
  }

  enhanceSkills(skills) {
    if (typeof skills === 'string') {
      // Parse and categorize skills
      const skillList = skills.split(',').map(s => s.trim());
      return {
        technical: skillList.filter(skill => this.skillsDatabase.technical.has(skill)),
        soft: skillList.filter(skill => this.skillsDatabase.soft.has(skill)),
        other: skillList.filter(skill => 
          !this.skillsDatabase.technical.has(skill) && 
          !this.skillsDatabase.soft.has(skill)
        )
      };
    }
    return skills;
  }

  generateSkillsSection(resumeData) {
    const detectedSkills = [];
    const resumeText = Object.values(resumeData).join(' ').toLowerCase();
    
    // Detect technical skills
    this.skillsDatabase.technical.forEach(skill => {
      if (resumeText.includes(skill.toLowerCase())) {
        detectedSkills.push(skill);
      }
    });

    return {
      technical: detectedSkills,
      soft: ['Problem Solving', 'Team Collaboration', 'Communication'],
      other: []
    };
  }

  // Calculate ATS score
  calculateATSScore(resumeData, keywords) {
    let score = 0;
    const maxScore = 100;
    const resumeText = Object.values(resumeData).join(' ').toLowerCase();

    // Keyword matching (40 points)
    const allKeywords = [...keywords.required, ...keywords.preferred, ...keywords.industry];
    const foundKeywords = allKeywords.filter(keyword => 
      resumeText.includes(keyword.toLowerCase())
    );
    score += (foundKeywords.length / allKeywords.length) * 40;

    // Structure score (30 points)
    const requiredSections = ['experience', 'education', 'skills'];
    const foundSections = requiredSections.filter(section => resumeData[section]);
    score += (foundSections.length / requiredSections.length) * 30;

    // Content quality (30 points)
    const hasActionVerbs = Object.values(this.actionVerbs).flat()
      .some(verb => resumeText.includes(verb.toLowerCase()));
    const hasQuantifiableResults = /\d+%|\d+\+|\$\d+/.test(resumeText);
    const hasRelevantContent = resumeText.length > 200 && resumeText.length < 2000;

    if (hasActionVerbs) score += 10;
    if (hasQuantifiableResults) score += 10;
    if (hasRelevantContent) score += 10;

    return {
      overall: Math.round(score),
      breakdown: {
        keywords: Math.round((foundKeywords.length / allKeywords.length) * 40),
        structure: Math.round((foundSections.length / requiredSections.length) * 30),
        content: Math.round((hasActionVerbs ? 10 : 0) + (hasQuantifiableResults ? 10 : 0) + (hasRelevantContent ? 10 : 0))
      },
      foundKeywords: foundKeywords,
      missingKeywords: allKeywords.filter(k => !foundKeywords.includes(k))
    };
  }

  // Generate recommendations
  generateRecommendations(analysis, atsScore) {
    const recommendations = [];

    if (atsScore.overall < 60) {
      recommendations.push({
        priority: 'high',
        category: 'ATS Optimization',
        suggestion: 'Your resume needs significant ATS optimization to pass automated screening',
        action: 'Add missing keywords and improve structure'
      });
    }

    if (analysis.quantifiableAchievements < 3) {
      recommendations.push({
        priority: 'high',
        category: 'Content',
        suggestion: 'Add more quantifiable achievements with specific numbers and percentages',
        action: 'Replace vague statements with measurable results'
      });
    }

    if (analysis.actionVerbsUsed.length < 5) {
      recommendations.push({
        priority: 'medium',
        category: 'Language',
        suggestion: 'Use more strong action verbs to start your bullet points',
        action: 'Replace weak verbs with impactful alternatives'
      });
    }

    if (atsScore.breakdown.keywords < 20) {
      recommendations.push({
        priority: 'high',
        category: 'Keywords',
        suggestion: 'Include more industry-relevant keywords throughout your resume',
        action: 'Naturally incorporate missing keywords from the job description'
      });
    }

    return recommendations;
  }

  // Helper methods
  calculateStructureScore(resumeData) {
    let score = 0;
    const requiredSections = ['summary', 'experience', 'education', 'skills'];
    const optionalSections = ['projects', 'certifications', 'achievements'];

    requiredSections.forEach(section => {
      if (resumeData[section]) score += 20;
    });

    optionalSections.forEach(section => {
      if (resumeData[section]) score += 5;
    });

    return Math.min(100, score);
  }

  calculateContentScore(analysis) {
    let score = 0;

    // Action verbs usage
    score += Math.min(30, analysis.actionVerbsUsed.length * 3);

    // Quantifiable achievements
    score += Math.min(25, analysis.quantifiableAchievements * 8);

    // Skills diversity
    score += Math.min(25, analysis.skillsFound.length * 2);

    // Word count appropriateness
    if (analysis.wordCount >= 300 && analysis.wordCount <= 600) {
      score += 20;
    } else if (analysis.wordCount >= 200 && analysis.wordCount <= 800) {
      score += 10;
    }

    return Math.min(100, score);
  }

  // Generate complete resume template
  generateResumeTemplate(userProfile, targetRole) {
    return {
      header: {
        name: userProfile.name || '[Your Name]',
        email: userProfile.email || '[Your Email]',
        phone: '[Your Phone]',
        location: '[Your Location]',
        linkedin: '[LinkedIn Profile]',
        github: '[GitHub Profile]'
      },
      summary: this.generateSummaryTemplate(targetRole),
      experience: this.generateExperienceTemplate(targetRole),
      education: this.generateEducationTemplate(),
      skills: this.generateSkillsTemplate(targetRole),
      projects: this.generateProjectsTemplate(targetRole),
      certifications: []
    };
  }

  generateSummaryTemplate(role) {
    const templates = {
      'Software Engineer': 'Experienced Software Engineer with expertise in full-stack development, proficient in modern technologies and frameworks. Proven track record of delivering scalable applications and collaborating effectively in agile environments.',
      'Data Scientist': 'Results-driven Data Scientist with strong background in machine learning, statistical analysis, and data visualization. Experienced in extracting actionable insights from complex datasets to drive business decisions.',
      'Product Manager': 'Strategic Product Manager with experience in product lifecycle management, user research, and cross-functional team leadership. Proven ability to translate business requirements into successful product features.'
    };

    return templates[role] || 'Dedicated professional with strong analytical and problem-solving skills, seeking to contribute expertise in a challenging role.';
  }

  generateExperienceTemplate(role) {
    return [
      {
        title: '[Job Title]',
        company: '[Company Name]',
        duration: '[Start Date] - [End Date]',
        description: '• Led development of key features resulting in 25% increase in user engagement\n• Collaborated with cross-functional teams to deliver projects on time and within budget\n• Implemented best practices that improved code quality and reduced bugs by 30%'
      }
    ];
  }

  generateEducationTemplate() {
    return [
      {
        degree: '[Degree Type]',
        institution: '[University Name]',
        year: '[Graduation Year]',
        gpa: '[GPA if above 3.5]'
      }
    ];
  }

  generateSkillsTemplate(role) {
    const skillTemplates = {
      'Software Engineer': {
        technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS'],
        soft: ['Problem Solving', 'Team Collaboration', 'Agile Methodologies']
      },
      'Data Scientist': {
        technical: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Tableau'],
        soft: ['Analytical Thinking', 'Communication', 'Project Management']
      }
    };

    return skillTemplates[role] || {
      technical: ['[Technical Skill 1]', '[Technical Skill 2]'],
      soft: ['Problem Solving', 'Communication', 'Leadership']
    };
  }

  generateProjectsTemplate(role) {
    return [
      {
        name: '[Project Name]',
        description: 'Brief description of the project and your role',
        technologies: ['Technology 1', 'Technology 2'],
        link: '[Project Link if available]'
      }
    ];
  }
}

module.exports = ResumeEnhancementEngine;