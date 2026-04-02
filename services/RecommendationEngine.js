const User = require('../models/User');
const Domain = require('../models/Domain');
const { UserActivity } = require('../models/Analytics');

class RecommendationEngine {
  constructor() {
    this.weights = {
      userPreference: 0.3,
      skillGap: 0.25,
      marketTrend: 0.2,
      difficulty: 0.15,
      popularity: 0.1
    };
  }

  // Generate personalized career roadmap
  async generateCareerRoadmap(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.selectedDomain) {
        throw new Error('User or domain not found');
      }

      const domain = await Domain.findOne({ name: user.selectedDomain });
      if (!domain) {
        throw new Error('Domain data not found');
      }

      // Analyze user's current skills and progress
      const userSkills = this.analyzeUserSkills(user);
      const skillGaps = this.identifySkillGaps(userSkills, domain);
      
      // Generate personalized learning path
      const roadmap = await this.createLearningPath(user, domain, skillGaps);
      
      return {
        roadmap,
        estimatedDuration: this.calculateTotalDuration(roadmap),
        difficulty: this.assessOverallDifficulty(roadmap),
        careerOutlook: this.getCareerOutlook(domain),
        nextMilestones: roadmap.slice(0, 3)
      };

    } catch (error) {
      console.error('Roadmap generation error:', error);
      throw error;
    }
  }

  // Analyze user's current skills
  analyzeUserSkills(user) {
    const skills = {
      completed: [],
      inProgress: [],
      proficiencyLevels: {}
    };

    // Analyze completed courses
    user.progress.completedCourses.forEach(courseId => {
      skills.completed.push(courseId);
    });

    // Analyze skill progress
    user.progress.completedSkills.forEach(skill => {
      skills.proficiencyLevels[skill.skillName] = {
        level: skill.level,
        experience: skill.experience,
        proficiency: skill.proficiencyLevel
      };
    });

    return skills;
  }

  // Identify skill gaps based on domain requirements
  identifySkillGaps(userSkills, domain) {
    const gaps = [];
    
    domain.careerPaths.forEach(careerPath => {
      careerPath.skills.forEach(skill => {
        const userSkill = userSkills.proficiencyLevels[skill.skill];
        
        if (!userSkill) {
          gaps.push({
            skill: skill.skill,
            requiredLevel: skill.level,
            currentLevel: 0,
            priority: 'High',
            estimatedHours: skill.estimatedHours
          });
        } else if (userSkill.level < skill.level) {
          gaps.push({
            skill: skill.skill,
            requiredLevel: skill.level,
            currentLevel: userSkill.level,
            priority: 'Medium',
            estimatedHours: skill.estimatedHours * (skill.level - userSkill.level) / skill.level
          });
        }
      });
    });

    // Sort by priority and impact
    return gaps.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Create personalized learning path
  async createLearningPath(user, domain, skillGaps) {
    const learningPath = [];
    const userLevel = user.progress.currentLevel;
    const userPreference = user.learningPreferences;

    // Group skills by dependency and difficulty
    const skillGroups = this.groupSkillsByDependency(skillGaps, domain);
    
    skillGroups.forEach((group, index) => {
      const milestone = {
        id: `milestone_${index + 1}`,
        title: `${group.category} Mastery`,
        description: `Master essential ${group.category.toLowerCase()} skills`,
        skills: group.skills,
        estimatedHours: group.skills.reduce((sum, skill) => sum + skill.estimatedHours, 0),
        difficulty: this.calculateGroupDifficulty(group.skills),
        prerequisites: index > 0 ? [`milestone_${index}`] : [],
        resources: this.selectOptimalResources(group.skills, domain, userPreference),
        projects: this.suggestProjects(group.skills, domain),
        isLocked: index > 0,
        order: index + 1
      };

      learningPath.push(milestone);
    });

    return learningPath;
  }

  // Group skills by dependency and logical progression
  groupSkillsByDependency(skillGaps, domain) {
    const groups = [
      { category: 'Foundation', skills: [], priority: 1 },
      { category: 'Core', skills: [], priority: 2 },
      { category: 'Advanced', skills: [], priority: 3 },
      { category: 'Specialization', skills: [], priority: 4 }
    ];

    // Categorize skills based on domain and complexity
    skillGaps.forEach(gap => {
      if (gap.requiredLevel <= 2) {
        groups[0].skills.push(gap);
      } else if (gap.requiredLevel <= 4) {
        groups[1].skills.push(gap);
      } else if (gap.requiredLevel <= 6) {
        groups[2].skills.push(gap);
      } else {
        groups[3].skills.push(gap);
      }
    });

    return groups.filter(group => group.skills.length > 0);
  }

  // Select optimal resources based on user preferences
  selectOptimalResources(skills, domain, userPreference) {
    const resources = [];
    
    skills.forEach(skill => {
      // Find matching skill in domain data
      domain.careerPaths.forEach(careerPath => {
        const domainSkill = careerPath.skills.find(s => s.skill === skill.skill);
        if (domainSkill && domainSkill.resources) {
          // Filter and rank resources
          const rankedResources = domainSkill.resources
            .filter(resource => {
              // Filter by user preference
              if (userPreference.preferredLearningStyle === 'Visual' && resource.type === 'video') return true;
              if (userPreference.preferredLearningStyle === 'Reading' && resource.type === 'article') return true;
              if (userPreference.preferredLearningStyle === 'Kinesthetic' && resource.type === 'practice') return true;
              return resource.isFree; // Default to free resources
            })
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3); // Top 3 resources per skill

          resources.push(...rankedResources);
        }
      });
    });

    return resources;
  }

  // Suggest relevant projects
  suggestProjects(skills, domain) {
    const projects = [];
    const skillNames = skills.map(s => s.skill);

    // Project suggestions based on skill combinations
    const projectTemplates = {
      'IT': [
        {
          title: 'Personal Portfolio Website',
          description: 'Build a responsive portfolio showcasing your skills',
          skills: ['HTML', 'CSS', 'JavaScript'],
          difficulty: 'Beginner',
          estimatedHours: 20
        },
        {
          title: 'Task Management App',
          description: 'Create a full-stack task management application',
          skills: ['React', 'Node.js', 'Database'],
          difficulty: 'Intermediate',
          estimatedHours: 40
        }
      ],
      'Finance': [
        {
          title: 'Investment Portfolio Tracker',
          description: 'Build a tool to track and analyze investment performance',
          skills: ['Excel', 'Financial Analysis', 'Data Visualization'],
          difficulty: 'Intermediate',
          estimatedHours: 30
        }
      ]
    };

    const domainProjects = projectTemplates[domain.name] || [];
    
    domainProjects.forEach(project => {
      const matchingSkills = project.skills.filter(skill => 
        skillNames.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      
      if (matchingSkills.length > 0) {
        projects.push({
          ...project,
          relevantSkills: matchingSkills,
          matchScore: matchingSkills.length / project.skills.length
        });
      }
    });

    return projects.sort((a, b) => b.matchScore - a.matchScore).slice(0, 2);
  }

  // Calculate total duration for roadmap
  calculateTotalDuration(roadmap) {
    const totalHours = roadmap.reduce((sum, milestone) => sum + milestone.estimatedHours, 0);
    
    return {
      hours: totalHours,
      weeks: Math.ceil(totalHours / 10), // Assuming 10 hours per week
      months: Math.ceil(totalHours / 40) // Assuming 40 hours per month
    };
  }

  // Assess overall difficulty
  assessOverallDifficulty(roadmap) {
    const difficulties = roadmap.map(milestone => {
      switch (milestone.difficulty) {
        case 'Beginner': return 1;
        case 'Intermediate': return 2;
        case 'Advanced': return 3;
        case 'Expert': return 4;
        default: return 2;
      }
    });

    const avgDifficulty = difficulties.reduce((sum, d) => sum + d, 0) / difficulties.length;
    
    if (avgDifficulty <= 1.5) return 'Beginner';
    if (avgDifficulty <= 2.5) return 'Intermediate';
    if (avgDifficulty <= 3.5) return 'Advanced';
    return 'Expert';
  }

  // Calculate group difficulty
  calculateGroupDifficulty(skills) {
    const avgLevel = skills.reduce((sum, skill) => sum + skill.requiredLevel, 0) / skills.length;
    
    if (avgLevel <= 2) return 'Beginner';
    if (avgLevel <= 4) return 'Intermediate';
    if (avgLevel <= 6) return 'Advanced';
    return 'Expert';
  }

  // Get career outlook information
  getCareerOutlook(domain) {
    return {
      growth: domain.marketTrends.growth,
      demand: domain.marketTrends.demand,
      averageSalary: domain.marketTrends.averageSalary,
      jobOpenings: domain.marketTrends.jobOpenings,
      topSkills: domain.marketTrends.topSkills,
      outlook: this.generateOutlookText(domain.marketTrends)
    };
  }

  // Generate career outlook text
  generateOutlookText(trends) {
    const growth = trends.growth || 'Medium';
    const demand = trends.demand || 'Medium';
    
    let outlook = `The ${trends.domain || 'field'} shows ${growth.toLowerCase()} growth potential with ${demand.toLowerCase()} market demand. `;
    
    if (trends.averageSalary) {
      outlook += `Average salary ranges around $${trends.averageSalary}. `;
    }
    
    if (trends.topSkills && trends.topSkills.length > 0) {
      outlook += `Key skills in demand include ${trends.topSkills.slice(0, 3).join(', ')}.`;
    }
    
    return outlook;
  }

  // Recommend next courses based on user progress
  async recommendNextCourses(userId, limit = 5) {
    const user = await User.findById(userId);
    if (!user) return [];

    const domain = await Domain.findOne({ name: user.selectedDomain });
    if (!domain) return [];

    const userSkills = this.analyzeUserSkills(user);
    const recommendations = [];

    // Find courses that match user's current level and interests
    domain.careerPaths.forEach(careerPath => {
      careerPath.skills.forEach(skill => {
        const userSkill = userSkills.proficiencyLevels[skill.skill];
        const currentLevel = userSkill ? userSkill.level : 0;
        
        if (skill.level === currentLevel + 1) {
          recommendations.push({
            skill: skill.skill,
            level: skill.level,
            resources: skill.resources,
            estimatedHours: skill.estimatedHours,
            priority: this.calculatePriority(skill, user),
            reason: `Next step in your ${skill.skill} learning journey`
          });
        }
      });
    });

    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  // Calculate recommendation priority
  calculatePriority(skill, user) {
    let priority = 0;
    
    // User preference weight
    if (user.profile.interests.includes(skill.skill)) {
      priority += this.weights.userPreference * 100;
    }
    
    // Market demand weight
    priority += this.weights.marketTrend * (skill.level * 10);
    
    // Difficulty appropriateness
    const userLevel = user.progress.currentLevel;
    if (skill.level <= userLevel + 1) {
      priority += this.weights.difficulty * 50;
    }
    
    return priority;
  }
}

module.exports = new RecommendationEngine();