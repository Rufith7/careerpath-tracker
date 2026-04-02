/**
 * Enhanced Career Database with Comprehensive Roadmaps
 * Based on industry-standard career progression paths
 */

class EnhancedCareerDatabase {
  static getCareerDatabase() {
    return [
      // IT & SOFTWARE DEVELOPMENT CAREERS
      {
        id: 'frontend-developer',
        title: 'Frontend Developer',
        category: 'IT',
        description: 'Create user interfaces and experiences for web applications using modern technologies',
        averageSalary: { min: 50000, max: 100000, currency: 'USD' },
        growthRate: 'very_high',
        demandLevel: 'very_high',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX Design', 'Responsive Design'],
        preferredEducation: ['bachelor', 'bootcamp', 'self_taught'],
        workEnvironment: ['remote', 'office', 'hybrid'],
        industryTrends: ['react', 'vue', 'angular', 'typescript', 'pwa'],
        roadmapStages: [
          {
            id: 1,
            name: 'Web Development Fundamentals',
            description: 'Master the basics of web development including HTML, CSS, and JavaScript',
            skills: [
              { name: 'HTML5', level: 'beginner', importance: 'high' },
              { name: 'CSS3', level: 'beginner', importance: 'high' },
              { name: 'JavaScript ES6+', level: 'beginner', importance: 'high' },
              { name: 'Responsive Design', level: 'beginner', importance: 'high' },
              { name: 'Git Version Control', level: 'beginner', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Personal Portfolio Website', 
                description: 'Build a responsive portfolio showcasing your skills with modern design',
                difficulty: 'beginner',
                estimatedHours: 40,
                technologies: ['HTML', 'CSS', 'JavaScript']
              },
              { 
                name: 'Business Landing Page', 
                description: 'Create a professional landing page with animations and contact forms',
                difficulty: 'beginner',
                estimatedHours: 30,
                technologies: ['HTML', 'CSS', 'JavaScript', 'Forms']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: [],
            learningResources: [
              { type: 'course', name: 'freeCodeCamp Web Development', url: 'https://freecodecamp.org' },
              { type: 'documentation', name: 'MDN Web Docs', url: 'https://developer.mozilla.org' }
            ]
          },
          {
            id: 2,
            name: 'Frontend Framework Mastery',
            description: 'Learn modern frontend frameworks and build interactive applications',
            skills: [
              { name: 'React.js', level: 'intermediate', importance: 'high' },
              { name: 'Component Architecture', level: 'intermediate', importance: 'high' },
              { name: 'State Management', level: 'intermediate', importance: 'high' },
              { name: 'API Integration', level: 'intermediate', importance: 'high' },
              { name: 'CSS Frameworks', level: 'intermediate', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'E-commerce Product Catalog', 
                description: 'Build a dynamic product listing with search, filters, and shopping cart',
                difficulty: 'intermediate',
                estimatedHours: 80,
                technologies: ['React', 'API', 'State Management']
              },
              { 
                name: 'Task Management App', 
                description: 'Create a full-featured todo application with user authentication',
                difficulty: 'intermediate',
                estimatedHours: 60,
                technologies: ['React', 'Firebase', 'Authentication']
              }
            ],
            estimatedDuration: '3-4 months',
            prerequisites: ['Web Development Fundamentals'],
            learningResources: [
              { type: 'course', name: 'React Official Tutorial', url: 'https://reactjs.org/tutorial' },
              { type: 'course', name: 'Modern React with Redux', url: 'https://udemy.com' }
            ]
          },
          {
            id: 3,
            name: 'Advanced Frontend Development',
            description: 'Master advanced concepts and build production-ready applications',
            skills: [
              { name: 'Redux/Context API', level: 'advanced', importance: 'high' },
              { name: 'Testing (Jest, React Testing Library)', level: 'advanced', importance: 'high' },
              { name: 'Performance Optimization', level: 'advanced', importance: 'high' },
              { name: 'TypeScript', level: 'advanced', importance: 'medium' },
              { name: 'Build Tools (Webpack, Vite)', level: 'advanced', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Social Media Dashboard', 
                description: 'Build a complex dashboard with real-time data and advanced interactions',
                difficulty: 'advanced',
                estimatedHours: 120,
                technologies: ['React', 'TypeScript', 'WebSocket', 'Charts']
              },
              { 
                name: 'Progressive Web App', 
                description: 'Create a PWA with offline capabilities and push notifications',
                difficulty: 'advanced',
                estimatedHours: 100,
                technologies: ['React', 'Service Workers', 'PWA APIs']
              }
            ],
            estimatedDuration: '4-5 months',
            prerequisites: ['Frontend Framework Mastery'],
            learningResources: [
              { type: 'course', name: 'Advanced React Patterns', url: 'https://kentcdodds.com' },
              { type: 'documentation', name: 'TypeScript Handbook', url: 'https://typescriptlang.org' }
            ]
          },
          // APTITUDE, PLACEMENT & INTERVIEW GOALS (included in every roadmap)
          {
            id: 4,
            name: 'Career Readiness & Interview Preparation',
            description: 'Prepare for job interviews and improve professional skills',
            skills: [
              { name: 'Technical Interview Skills', level: 'intermediate', importance: 'high' },
              { name: 'System Design Basics', level: 'intermediate', importance: 'high' },
              { name: 'Communication Skills', level: 'intermediate', importance: 'high' },
              { name: 'Problem Solving', level: 'intermediate', importance: 'high' },
              { name: 'Resume Building', level: 'beginner', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Technical Interview Preparation', 
                description: 'Practice coding challenges and technical questions',
                difficulty: 'intermediate',
                estimatedHours: 60,
                technologies: ['Algorithms', 'Data Structures', 'JavaScript']
              },
              { 
                name: 'Professional Portfolio Enhancement', 
                description: 'Create a comprehensive portfolio with case studies',
                difficulty: 'intermediate',
                estimatedHours: 40,
                technologies: ['Portfolio Design', 'Case Studies', 'Documentation']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: ['Advanced Frontend Development'],
            learningResources: [
              { type: 'platform', name: 'LeetCode Frontend Questions', url: 'https://leetcode.com' },
              { type: 'course', name: 'Interview Preparation Course', url: 'https://interviewbit.com' }
            ]
          }
        ]
      },

      {
        id: 'fullstack-developer',
        title: 'Full Stack Developer',
        category: 'IT',
        description: 'Develop both frontend and backend components of web applications',
        averageSalary: { min: 70000, max: 140000, currency: 'USD' },
        growthRate: 'very_high',
        demandLevel: 'very_high',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Databases', 'API Development', 'DevOps'],
        preferredEducation: ['bachelor', 'bootcamp', 'self_taught'],
        workEnvironment: ['remote', 'office', 'hybrid'],
        industryTrends: ['mern_stack', 'serverless', 'microservices', 'docker', 'cloud'],
        roadmapStages: [
          {
            id: 1,
            name: 'Frontend Foundation',
            description: 'Build strong frontend development skills',
            skills: [
              { name: 'HTML5', level: 'intermediate', importance: 'high' },
              { name: 'CSS3', level: 'intermediate', importance: 'high' },
              { name: 'JavaScript', level: 'intermediate', importance: 'high' },
              { name: 'React', level: 'intermediate', importance: 'high' },
              { name: 'Responsive Design', level: 'intermediate', importance: 'high' }
            ],
            projects: [
              { 
                name: 'Interactive Web Portfolio', 
                description: 'Showcase your skills with animations and interactions',
                difficulty: 'intermediate',
                estimatedHours: 50,
                technologies: ['React', 'CSS Animations', 'JavaScript']
              },
              { 
                name: 'Restaurant Website', 
                description: 'Build a complete restaurant website with menu and booking system',
                difficulty: 'intermediate',
                estimatedHours: 70,
                technologies: ['React', 'Forms', 'API Integration']
              }
            ],
            estimatedDuration: '3-4 months',
            prerequisites: [],
            learningResources: [
              { type: 'course', name: 'Complete React Course', url: 'https://reactjs.org' },
              { type: 'course', name: 'JavaScript Mastery', url: 'https://javascript.info' }
            ]
          },
          {
            id: 2,
            name: 'Backend Development',
            description: 'Learn server-side development and database management',
            skills: [
              { name: 'Node.js', level: 'intermediate', importance: 'high' },
              { name: 'Express.js', level: 'intermediate', importance: 'high' },
              { name: 'MongoDB', level: 'intermediate', importance: 'high' },
              { name: 'RESTful APIs', level: 'intermediate', importance: 'high' },
              { name: 'Authentication & Security', level: 'intermediate', importance: 'high' }
            ],
            projects: [
              { 
                name: 'Blog API with Authentication', 
                description: 'Create a complete blog backend with user management and CRUD operations',
                difficulty: 'intermediate',
                estimatedHours: 80,
                technologies: ['Node.js', 'Express', 'MongoDB', 'JWT']
              },
              { 
                name: 'E-commerce Backend', 
                description: 'Build a scalable e-commerce API with payment integration',
                difficulty: 'advanced',
                estimatedHours: 120,
                technologies: ['Node.js', 'Express', 'MongoDB', 'Stripe API']
              }
            ],
            estimatedDuration: '4-5 months',
            prerequisites: ['Frontend Foundation'],
            learningResources: [
              { type: 'course', name: 'Node.js Complete Guide', url: 'https://nodejs.org' },
              { type: 'course', name: 'MongoDB University', url: 'https://university.mongodb.com' }
            ]
          },
          {
            id: 3,
            name: 'Full Stack Integration',
            description: 'Combine frontend and backend to build complete applications',
            skills: [
              { name: 'MERN Stack', level: 'advanced', importance: 'high' },
              { name: 'Deployment & DevOps', level: 'intermediate', importance: 'high' },
              { name: 'Testing (Unit & Integration)', level: 'intermediate', importance: 'high' },
              { name: 'Performance Optimization', level: 'intermediate', importance: 'medium' },
              { name: 'Cloud Services (AWS/Heroku)', level: 'intermediate', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Social Media Platform', 
                description: 'Build a complete social media app with real-time features',
                difficulty: 'advanced',
                estimatedHours: 200,
                technologies: ['MERN Stack', 'Socket.io', 'Cloud Storage']
              },
              { 
                name: 'Project Management Tool', 
                description: 'Create a comprehensive project management system with team collaboration',
                difficulty: 'advanced',
                estimatedHours: 180,
                technologies: ['MERN Stack', 'Real-time Updates', 'File Upload']
              }
            ],
            estimatedDuration: '5-6 months',
            prerequisites: ['Backend Development'],
            learningResources: [
              { type: 'course', name: 'MERN Stack Development', url: 'https://fullstackopen.com' },
              { type: 'course', name: 'AWS for Developers', url: 'https://aws.amazon.com/training' }
            ]
          },
          {
            id: 4,
            name: 'Career Readiness & Interview Preparation',
            description: 'Prepare for full stack developer interviews and improve professional skills',
            skills: [
              { name: 'System Design', level: 'intermediate', importance: 'high' },
              { name: 'Technical Interview Skills', level: 'intermediate', importance: 'high' },
              { name: 'Code Review Skills', level: 'intermediate', importance: 'high' },
              { name: 'Communication Skills', level: 'intermediate', importance: 'high' },
              { name: 'Portfolio Presentation', level: 'intermediate', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'System Design Case Studies', 
                description: 'Document and present system architecture for your projects',
                difficulty: 'intermediate',
                estimatedHours: 40,
                technologies: ['System Design', 'Documentation', 'Presentation']
              },
              { 
                name: 'Open Source Contributions', 
                description: 'Contribute to open source projects to demonstrate collaboration skills',
                difficulty: 'intermediate',
                estimatedHours: 60,
                technologies: ['Git', 'Collaboration', 'Code Review']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: ['Full Stack Integration'],
            learningResources: [
              { type: 'book', name: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net' },
              { type: 'platform', name: 'System Design Interview', url: 'https://github.com/donnemartin/system-design-primer' }
            ]
          }
        ]
      },

      // DATA ANALYTICS & AI CAREERS
      {
        id: 'data-analyst',
        title: 'Data Analyst',
        category: 'DataScience',
        description: 'Analyze data to provide insights for business decision-making',
        averageSalary: { min: 55000, max: 95000, currency: 'USD' },
        growthRate: 'high',
        demandLevel: 'high',
        requiredSkills: ['Excel', 'SQL', 'Python', 'Data Visualization', 'Statistics'],
        preferredEducation: ['bachelor', 'master'],
        workEnvironment: ['remote', 'office', 'hybrid'],
        industryTrends: ['power_bi', 'tableau', 'python', 'machine_learning', 'cloud_analytics'],
        roadmapStages: [
          {
            id: 1,
            name: 'Data Analysis Fundamentals',
            description: 'Learn the basics of data analysis and visualization',
            skills: [
              { name: 'Excel Advanced', level: 'intermediate', importance: 'high' },
              { name: 'SQL', level: 'beginner', importance: 'high' },
              { name: 'Data Cleaning', level: 'beginner', importance: 'high' },
              { name: 'Basic Statistics', level: 'beginner', importance: 'high' },
              { name: 'Data Visualization Principles', level: 'beginner', importance: 'high' }
            ],
            projects: [
              { 
                name: 'Sales Performance Dashboard', 
                description: 'Create interactive dashboards using Excel and Power BI',
                difficulty: 'beginner',
                estimatedHours: 40,
                technologies: ['Excel', 'Power BI', 'SQL']
              },
              { 
                name: 'Customer Segmentation Analysis', 
                description: 'Analyze customer data to identify key segments and patterns',
                difficulty: 'beginner',
                estimatedHours: 50,
                technologies: ['Excel', 'SQL', 'Statistical Analysis']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: [],
            learningResources: [
              { type: 'course', name: 'Excel for Data Analysis', url: 'https://microsoft.com/excel' },
              { type: 'course', name: 'SQL for Data Science', url: 'https://sqlbolt.com' }
            ]
          },
          {
            id: 2,
            name: 'Programming for Data',
            description: 'Master Python and advanced analytics tools',
            skills: [
              { name: 'Python', level: 'intermediate', importance: 'high' },
              { name: 'Pandas', level: 'intermediate', importance: 'high' },
              { name: 'NumPy', level: 'intermediate', importance: 'high' },
              { name: 'Matplotlib/Seaborn', level: 'intermediate', importance: 'high' },
              { name: 'Jupyter Notebooks', level: 'intermediate', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Market Research Analysis', 
                description: 'Analyze market trends using Python and statistical methods',
                difficulty: 'intermediate',
                estimatedHours: 70,
                technologies: ['Python', 'Pandas', 'Matplotlib', 'Statistics']
              },
              { 
                name: 'Financial Data Analysis', 
                description: 'Build automated reports for financial performance tracking',
                difficulty: 'intermediate',
                estimatedHours: 80,
                technologies: ['Python', 'Pandas', 'Financial APIs', 'Automation']
              }
            ],
            estimatedDuration: '3-4 months',
            prerequisites: ['Data Analysis Fundamentals'],
            learningResources: [
              { type: 'course', name: 'Python for Data Science', url: 'https://python.org' },
              { type: 'course', name: 'Pandas Documentation', url: 'https://pandas.pydata.org' }
            ]
          },
          {
            id: 3,
            name: 'Advanced Analytics',
            description: 'Apply advanced statistical methods and business intelligence',
            skills: [
              { name: 'Power BI/Tableau', level: 'advanced', importance: 'high' },
              { name: 'Advanced Statistics', level: 'advanced', importance: 'high' },
              { name: 'A/B Testing', level: 'intermediate', importance: 'high' },
              { name: 'Predictive Analytics', level: 'intermediate', importance: 'medium' },
              { name: 'Business Intelligence', level: 'intermediate', importance: 'high' }
            ],
            projects: [
              { 
                name: 'Business Intelligence Dashboard', 
                description: 'Create comprehensive BI solution for enterprise decision-making',
                difficulty: 'advanced',
                estimatedHours: 120,
                technologies: ['Tableau/Power BI', 'SQL', 'Statistical Analysis']
              },
              { 
                name: 'Predictive Sales Model', 
                description: 'Build models to forecast sales and revenue trends',
                difficulty: 'advanced',
                estimatedHours: 100,
                technologies: ['Python', 'Machine Learning', 'Time Series Analysis']
              }
            ],
            estimatedDuration: '4-5 months',
            prerequisites: ['Programming for Data'],
            learningResources: [
              { type: 'course', name: 'Tableau Training', url: 'https://tableau.com/learn' },
              { type: 'course', name: 'Advanced Statistics', url: 'https://coursera.org/statistics' }
            ]
          },
          {
            id: 4,
            name: 'Career Readiness & Interview Preparation',
            description: 'Prepare for data analyst interviews and improve professional skills',
            skills: [
              { name: 'Technical Interview Skills', level: 'intermediate', importance: 'high' },
              { name: 'Case Study Presentation', level: 'intermediate', importance: 'high' },
              { name: 'Business Communication', level: 'intermediate', importance: 'high' },
              { name: 'Portfolio Development', level: 'intermediate', importance: 'high' },
              { name: 'Industry Knowledge', level: 'intermediate', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Data Analysis Portfolio', 
                description: 'Create a comprehensive portfolio showcasing various analysis projects',
                difficulty: 'intermediate',
                estimatedHours: 60,
                technologies: ['Portfolio Design', 'Case Studies', 'Presentation']
              },
              { 
                name: 'Mock Interview Preparation', 
                description: 'Practice technical questions and case study presentations',
                difficulty: 'intermediate',
                estimatedHours: 40,
                technologies: ['Interview Skills', 'Technical Questions', 'Communication']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: ['Advanced Analytics'],
            learningResources: [
              { type: 'platform', name: 'Data Science Interview Questions', url: 'https://github.com/alexeygrigorev/data-science-interviews' },
              { type: 'course', name: 'Business Communication for Analysts', url: 'https://coursera.org/business-communication' }
            ]
          }
        ]
      },

      // FINANCE & ACCOUNTING CAREERS
      {
        id: 'financial-analyst',
        title: 'Financial Analyst',
        category: 'Finance',
        description: 'Analyze financial data and provide investment recommendations',
        averageSalary: { min: 60000, max: 120000, currency: 'USD' },
        growthRate: 'moderate',
        demandLevel: 'high',
        requiredSkills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Valuation', 'Market Research'],
        preferredEducation: ['bachelor', 'master', 'cfa'],
        workEnvironment: ['office', 'hybrid'],
        industryTrends: ['fintech', 'esg_investing', 'cryptocurrency', 'robo_advisors', 'blockchain'],
        roadmapStages: [
          {
            id: 1,
            name: 'Financial Fundamentals',
            description: 'Master basic financial concepts and analysis tools',
            skills: [
              { name: 'Financial Literacy', level: 'beginner', importance: 'high' },
              { name: 'Accounting Basics', level: 'beginner', importance: 'high' },
              { name: 'Excel Advanced', level: 'intermediate', importance: 'high' },
              { name: 'Financial Statements Analysis', level: 'beginner', importance: 'high' },
              { name: 'Time Value of Money', level: 'beginner', importance: 'high' }
            ],
            projects: [
              { 
                name: 'Personal Finance Tracker', 
                description: 'Build comprehensive personal budgeting and investment tracking system',
                difficulty: 'beginner',
                estimatedHours: 40,
                technologies: ['Excel', 'Financial Formulas', 'Dashboard Design']
              },
              { 
                name: 'Company Financial Analysis', 
                description: 'Analyze public company financial statements and create reports',
                difficulty: 'beginner',
                estimatedHours: 50,
                technologies: ['Excel', 'Financial Ratios', 'Report Writing']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: [],
            learningResources: [
              { type: 'course', name: 'Financial Accounting Fundamentals', url: 'https://coursera.org/finance' },
              { type: 'book', name: 'Financial Statement Analysis', url: 'https://amazon.com' }
            ]
          },
          {
            id: 2,
            name: 'Investment Analysis',
            description: 'Learn investment principles and market analysis',
            skills: [
              { name: 'Stock Market Analysis', level: 'intermediate', importance: 'high' },
              { name: 'Investment Principles', level: 'intermediate', importance: 'high' },
              { name: 'Portfolio Management', level: 'intermediate', importance: 'high' },
              { name: 'Risk Assessment', level: 'intermediate', importance: 'high' },
              { name: 'Market Research', level: 'intermediate', importance: 'high' }
            ],
            projects: [
              { 
                name: 'Stock Portfolio Tracker', 
                description: 'Create automated portfolio performance tracking and analysis system',
                difficulty: 'intermediate',
                estimatedHours: 80,
                technologies: ['Excel/Python', 'Financial APIs', 'Data Visualization']
              },
              { 
                name: 'Investment Research Report', 
                description: 'Conduct comprehensive company valuation and investment recommendation',
                difficulty: 'intermediate',
                estimatedHours: 100,
                technologies: ['Financial Analysis', 'Research Methods', 'Report Writing']
              }
            ],
            estimatedDuration: '3-4 months',
            prerequisites: ['Financial Fundamentals'],
            learningResources: [
              { type: 'course', name: 'Investment Analysis', url: 'https://cfa.org' },
              { type: 'platform', name: 'Bloomberg Terminal Training', url: 'https://bloomberg.com' }
            ]
          },
          {
            id: 3,
            name: 'Advanced Financial Modeling',
            description: 'Build complex financial models and valuations',
            skills: [
              { name: 'Financial Modeling', level: 'advanced', importance: 'high' },
              { name: 'DCF Analysis', level: 'advanced', importance: 'high' },
              { name: 'Scenario Planning', level: 'advanced', importance: 'high' },
              { name: 'Advanced Excel/VBA', level: 'advanced', importance: 'high' },
              { name: 'Valuation Methods', level: 'advanced', importance: 'high' }
            ],
            projects: [
              { 
                name: 'DCF Valuation Model', 
                description: 'Build comprehensive company valuation models with sensitivity analysis',
                difficulty: 'advanced',
                estimatedHours: 120,
                technologies: ['Excel', 'VBA', 'Financial Modeling', 'Valuation']
              },
              { 
                name: 'Risk Management Dashboard', 
                description: 'Create portfolio risk analysis and stress testing tools',
                difficulty: 'advanced',
                estimatedHours: 100,
                technologies: ['Excel', 'Risk Models', 'Monte Carlo Simulation']
              }
            ],
            estimatedDuration: '4-5 months',
            prerequisites: ['Investment Analysis'],
            learningResources: [
              { type: 'course', name: 'Advanced Financial Modeling', url: 'https://wharton.upenn.edu' },
              { type: 'certification', name: 'CFA Level 1', url: 'https://cfa.org' }
            ]
          },
          {
            id: 4,
            name: 'Career Readiness & Interview Preparation',
            description: 'Prepare for financial analyst interviews and improve professional skills',
            skills: [
              { name: 'Technical Interview Skills', level: 'intermediate', importance: 'high' },
              { name: 'Case Study Analysis', level: 'intermediate', importance: 'high' },
              { name: 'Financial Presentation Skills', level: 'intermediate', importance: 'high' },
              { name: 'Industry Knowledge', level: 'intermediate', importance: 'high' },
              { name: 'Professional Networking', level: 'intermediate', importance: 'medium' }
            ],
            projects: [
              { 
                name: 'Investment Pitch Presentation', 
                description: 'Create and present investment recommendations to mock panel',
                difficulty: 'intermediate',
                estimatedHours: 60,
                technologies: ['PowerPoint', 'Financial Analysis', 'Presentation Skills']
              },
              { 
                name: 'Financial Modeling Case Studies', 
                description: 'Complete various financial modeling challenges and case studies',
                difficulty: 'intermediate',
                estimatedHours: 80,
                technologies: ['Excel', 'Financial Modeling', 'Case Analysis']
              }
            ],
            estimatedDuration: '2-3 months',
            prerequisites: ['Advanced Financial Modeling'],
            learningResources: [
              { type: 'platform', name: 'Wall Street Prep', url: 'https://wallstreetprep.com' },
              { type: 'book', name: 'Investment Banking Interview Guide', url: 'https://amazon.com' }
            ]
          }
        ]
      }
    ];
  }

  static getAptitudeAndInterviewGoals() {
    return {
      id: 'aptitude-interview-prep',
      name: 'Aptitude, Placement & Interview Goals',
      description: 'Essential skills for career readiness and job placement success',
      skills: [
        { name: 'Quantitative Aptitude', level: 'intermediate', importance: 'high' },
        { name: 'Logical Reasoning', level: 'intermediate', importance: 'high' },
        { name: 'Verbal Ability', level: 'intermediate', importance: 'high' },
        { name: 'Technical Interview Skills', level: 'intermediate', importance: 'high' },
        { name: 'HR Interview Skills', level: 'intermediate', importance: 'high' },
        { name: 'Communication Skills', level: 'intermediate', importance: 'high' },
        { name: 'Resume Building', level: 'beginner', importance: 'medium' },
        { name: 'Group Discussion', level: 'intermediate', importance: 'medium' }
      ],
      projects: [
        { 
          name: 'Aptitude Test Preparation', 
          description: 'Complete comprehensive aptitude test preparation covering all major topics',
          difficulty: 'intermediate',
          estimatedHours: 100,
          technologies: ['Problem Solving', 'Time Management', 'Test Strategy']
        },
        { 
          name: 'Mock Interview Sessions', 
          description: 'Participate in multiple mock interview sessions for technical and HR rounds',
          difficulty: 'intermediate',
          estimatedHours: 40,
          technologies: ['Interview Skills', 'Communication', 'Confidence Building']
        },
        { 
          name: 'Professional Resume & Portfolio', 
          description: 'Create industry-standard resume and professional portfolio',
          difficulty: 'beginner',
          estimatedHours: 20,
          technologies: ['Resume Writing', 'Portfolio Design', 'Professional Branding']
        }
      ],
      learningResources: [
        { type: 'platform', name: 'IndiaBix Aptitude', url: 'https://indiabix.com' },
        { type: 'platform', name: 'GeeksforGeeks Interview Preparation', url: 'https://geeksforgeeks.org' },
        { type: 'course', name: 'Communication Skills for Professionals', url: 'https://coursera.org' },
        { type: 'platform', name: 'LeetCode Interview Questions', url: 'https://leetcode.com' }
      ]
    };
  }
}

module.exports = EnhancedCareerDatabase;