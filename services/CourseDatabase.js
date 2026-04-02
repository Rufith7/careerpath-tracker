/**
 * COMPREHENSIVE COURSE DATABASE
 * Domain-specific courses with real learning resources and links
 */

class CourseDatabase {
  constructor() {
    this.courses = this.initializeCourses();
  }

  initializeCourses() {
    return {
      'IT': {
        name: 'Information Technology & Web Development',
        description: 'Comprehensive IT and web development courses with hands-on coding environments',
        icon: '💻',
        courses: [
          {
            id: 'it_001',
            title: 'Complete Web Development Bootcamp',
            provider: 'freeCodeCamp',
            description: 'The gold standard for free IT learning. 3,000+ hours covering Responsive Web Design, JavaScript, Machine Learning, and Cybersecurity.',
            level: 'Beginner to Advanced',
            duration: '300+ hours',
            certificate: 'Free Certificate',
            rating: 4.9,
            students: '400,000+',
            link: 'https://www.freecodecamp.org/',
            topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases', 'Machine Learning'],
            skills: ['Frontend Development', 'Backend Development', 'Full Stack', 'Problem Solving'],
            prerequisites: 'None - Beginner Friendly',
            outcomes: ['Build responsive websites', 'Create web applications', 'Understand programming fundamentals', 'Get job-ready skills']
          },
          {
            id: 'it_002',
            title: 'Full-Stack Developer Path',
            provider: 'The Odin Project',
            description: 'Best for becoming a Full-Stack Developer. Open-source, project-based curriculum that mimics real-world workflow.',
            level: 'Beginner to Advanced',
            duration: '200+ hours',
            certificate: 'Project Portfolio',
            rating: 4.8,
            students: '200,000+',
            link: 'https://www.theodinproject.com/',
            topics: ['HTML/CSS', 'JavaScript', 'Ruby on Rails', 'React', 'Git', 'Databases'],
            skills: ['Full Stack Development', 'Version Control', 'Project Management', 'Code Review'],
            prerequisites: 'Basic computer skills',
            outcomes: ['Build full-stack applications', 'Create professional portfolio', 'Master Git workflow', 'Industry-ready skills']
          },
          {
            id: 'it_003',
            title: 'Introduction to Computer Science',
            provider: 'Harvard CS50 (edX)',
            description: 'Arguably the best "Introduction to Computer Science" course in the world. Comprehensive CS fundamentals.',
            level: 'Beginner',
            duration: '100+ hours',
            certificate: 'Verified Certificate Available',
            rating: 4.9,
            students: '2,000,000+',
            link: 'https://www.edx.org/cs50',
            topics: ['Programming Fundamentals', 'Algorithms', 'Data Structures', 'Web Development', 'Mobile Development'],
            skills: ['Problem Solving', 'Algorithmic Thinking', 'Programming Logic', 'Computer Science Fundamentals'],
            prerequisites: 'None',
            outcomes: ['Understand CS fundamentals', 'Learn multiple programming languages', 'Build various projects', 'Strong foundation for advanced topics']
          },
          {
            id: 'it_004',
            title: 'Advanced Web Development Documentation',
            provider: 'MDN Web Docs',
            description: 'The "Encyclopedia" of the web. Essential for advanced learners to understand deep technical documentation.',
            level: 'Intermediate to Advanced',
            duration: 'Self-paced',
            certificate: 'Knowledge Base',
            rating: 4.9,
            students: '10,000,000+',
            link: 'https://developer.mozilla.org/en-US/',
            topics: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Web APIs', 'Browser Technologies', 'Performance'],
            skills: ['Advanced Web Development', 'Technical Documentation', 'Browser APIs', 'Performance Optimization'],
            prerequisites: 'Basic web development knowledge',
            outcomes: ['Master advanced web technologies', 'Understand browser internals', 'Optimize web performance', 'Stay updated with latest standards']
          }
        ]
      },
      'Finance': {
        name: 'Finance & Accounting',
        description: 'Financial literacy, corporate finance, and market analysis courses',
        icon: '💰',
        courses: [
          {
            id: 'fin_001',
            title: 'Corporate Finance Fundamentals',
            provider: 'Corporate Finance Institute (CFI)',
            description: 'Excellent free introductory courses on Financial Modeling, Excel, and Accounting from industry professionals.',
            level: 'Beginner to Intermediate',
            duration: '50+ hours',
            certificate: 'Free Certificate',
            rating: 4.7,
            students: '500,000+',
            link: 'https://help.corporatefinanceinstitute.com/article/1184-the-cfi-career-map',
            topics: ['Financial Modeling', 'Excel for Finance', 'Accounting Principles', 'Valuation', 'Financial Analysis'],
            skills: ['Financial Analysis', 'Excel Modeling', 'Valuation Techniques', 'Financial Reporting'],
            prerequisites: 'Basic math and Excel knowledge',
            outcomes: ['Build financial models', 'Analyze company performance', 'Create professional reports', 'Industry-ready skills']
          },
          {
            id: 'fin_002',
            title: 'Finance & Capital Markets',
            provider: 'Khan Academy',
            description: 'Best for beginners to understand interest, stocks, bonds, and macroeconomics. Comprehensive financial education.',
            level: 'Beginner',
            duration: '40+ hours',
            certificate: 'Completion Certificate',
            rating: 4.8,
            students: '1,000,000+',
            link: 'https://www.khanacademy.org/economics-finance-domain',
            topics: ['Interest & Debt', 'Housing', 'Inflation', 'Taxes', 'Stocks & Bonds', 'Investment Vehicles'],
            skills: ['Financial Literacy', 'Investment Analysis', 'Economic Understanding', 'Personal Finance'],
            prerequisites: 'None - Beginner Friendly',
            outcomes: ['Understand financial markets', 'Make informed investment decisions', 'Grasp economic principles', 'Personal financial planning']
          },
          {
            id: 'fin_003',
            title: 'Investment & Trading Fundamentals',
            provider: 'Investopedia Academy',
            description: 'Vast library of articles and resources. Best free resource for market terminology and investment strategies.',
            level: 'Beginner to Advanced',
            duration: 'Self-paced',
            certificate: 'Knowledge Certification',
            rating: 4.6,
            students: '5,000,000+',
            link: 'https://www.investopedia.com/',
            topics: ['Stock Market', 'Options Trading', 'Portfolio Management', 'Risk Assessment', 'Market Analysis'],
            skills: ['Investment Strategy', 'Market Analysis', 'Risk Management', 'Portfolio Optimization'],
            prerequisites: 'Basic finance knowledge helpful',
            outcomes: ['Understand investment vehicles', 'Develop trading strategies', 'Manage investment risk', 'Build diversified portfolios']
          },
          {
            id: 'fin_004',
            title: 'Sustainable Finance & Development',
            provider: 'UN SDG Academy',
            description: 'Advanced courses on "Sustainable Finance" and global economic development for future-focused professionals.',
            level: 'Advanced',
            duration: '60+ hours',
            certificate: 'UN Certificate',
            rating: 4.5,
            students: '100,000+',
            link: 'https://sdgacademy.org/',
            topics: ['Sustainable Development Goals', 'Green Finance', 'Impact Investing', 'ESG Criteria', 'Climate Finance'],
            skills: ['Sustainable Finance', 'Impact Assessment', 'ESG Analysis', 'Global Development'],
            prerequisites: 'Intermediate finance knowledge',
            outcomes: ['Understand sustainable finance', 'Evaluate ESG investments', 'Contribute to global development', 'Future-ready finance skills']
          }
        ]
      },
      'Healthcare': {
        name: 'Healthcare & Life Sciences',
        description: 'Medical education, public health, and life sciences courses',
        icon: '🏥',
        courses: [
          {
            id: 'health_001',
            title: 'Medical Education & CME Courses',
            provider: 'Stanford Medicine Online',
            description: 'Massive collection of free CME (Continuing Medical Education) courses and webinars with certificates from Stanford.',
            level: 'Professional',
            duration: '100+ hours',
            certificate: 'CME Credits & Certificates',
            rating: 4.8,
            students: '50,000+',
            link: 'https://med.stanford.edu/spectrum/education-and-training/research-career-accelerator-program.html',
            topics: ['Clinical Medicine', 'Research Methods', 'Patient Care', 'Medical Ethics', 'Healthcare Innovation'],
            skills: ['Clinical Skills', 'Medical Research', 'Patient Communication', 'Evidence-Based Medicine'],
            prerequisites: 'Medical background preferred',
            outcomes: ['Earn CME credits', 'Stay updated with medical advances', 'Improve patient care', 'Professional development']
          },
          {
            id: 'health_002',
            title: 'Global Health & Emergency Response',
            provider: 'WHO Open Learning',
            description: 'World Health Organization platform for epidemics, health emergencies, and public health management.',
            level: 'Intermediate to Advanced',
            duration: '80+ hours',
            certificate: 'WHO Certificates',
            rating: 4.7,
            students: '200,000+',
            link: 'https://openwho.org/',
            topics: ['Epidemiology', 'Emergency Response', 'Public Health', 'Disease Prevention', 'Health Systems'],
            skills: ['Public Health Management', 'Emergency Response', 'Epidemiological Analysis', 'Global Health Policy'],
            prerequisites: 'Basic health knowledge',
            outcomes: ['Understand global health challenges', 'Manage health emergencies', 'Develop public health programs', 'WHO certification']
          },
          {
            id: 'health_003',
            title: 'Nursing & Community Health',
            provider: 'NextGenU',
            description: 'Free, accredited-equivalent courses in nursing, community health, and preventive medicine.',
            level: 'Beginner to Intermediate',
            duration: '120+ hours',
            certificate: 'Accredited Certificates',
            rating: 4.6,
            students: '75,000+',
            link: 'https://nextgenu.org/',
            topics: ['Nursing Fundamentals', 'Community Health', 'Preventive Medicine', 'Health Promotion', 'Patient Care'],
            skills: ['Nursing Care', 'Community Health Assessment', 'Health Education', 'Preventive Care'],
            prerequisites: 'High school education',
            outcomes: ['Develop nursing skills', 'Understand community health', 'Promote health education', 'Career preparation']
          },
          {
            id: 'health_004',
            title: 'Medical Imaging & Radiology',
            provider: 'Radiopaedia',
            description: 'The "Wikipedia" of Radiology. Thousands of real-world medical imaging cases (X-rays, CTs, MRIs).',
            level: 'Professional',
            duration: 'Self-paced',
            certificate: 'Case Studies Completion',
            rating: 4.9,
            students: '1,000,000+',
            link: 'https://radiopaedia.org/',
            topics: ['Medical Imaging', 'Radiology', 'Diagnostic Imaging', 'Case Studies', 'Anatomy'],
            skills: ['Image Interpretation', 'Diagnostic Skills', 'Anatomical Knowledge', 'Clinical Correlation'],
            prerequisites: 'Medical or radiology background',
            outcomes: ['Master medical imaging', 'Improve diagnostic skills', 'Learn from real cases', 'Professional development']
          }
        ]
      },
      'DataScience': {
        name: 'Data Science & Analytics',
        description: 'Data analysis, machine learning, and research methodology courses',
        icon: '📊',
        courses: [
          {
            id: 'ds_001',
            title: 'Research Writing & Methodology',
            provider: 'AuthorAID',
            description: 'Global network providing free courses in research writing, grant proposal writing, and statistical analysis.',
            level: 'Intermediate to Advanced',
            duration: '60+ hours',
            certificate: 'Research Certificates',
            rating: 4.5,
            students: '100,000+',
            link: 'https://www.authoraid.info/',
            topics: ['Research Methodology', 'Statistical Analysis', 'Grant Writing', 'Academic Writing', 'Data Analysis'],
            skills: ['Research Design', 'Statistical Analysis', 'Academic Writing', 'Grant Proposal Writing'],
            prerequisites: 'Basic research knowledge',
            outcomes: ['Conduct quality research', 'Write research papers', 'Secure research funding', 'Publish academic work']
          },
          {
            id: 'ds_002',
            title: 'Advanced Research Methods',
            provider: 'NCRM (National Centre for Research Methods)',
            description: 'Over 100 free tutorials on "Qualitative Research" and "Statistical Modelling" for advanced researchers.',
            level: 'Advanced',
            duration: '100+ hours',
            certificate: 'Completion Certificates',
            rating: 4.7,
            students: '50,000+',
            link: 'https://www.ncrm.ac.uk/resources/online/',
            topics: ['Qualitative Research', 'Statistical Modelling', 'Mixed Methods', 'Data Collection', 'Analysis Techniques'],
            skills: ['Advanced Statistics', 'Qualitative Analysis', 'Research Design', 'Data Interpretation'],
            prerequisites: 'Research background required',
            outcomes: ['Master research methods', 'Conduct advanced analysis', 'Design robust studies', 'Professional research skills']
          },
          {
            id: 'ds_003',
            title: 'Systematic Reviews & Meta-Analysis',
            provider: 'Cochrane Interactive Learning',
            description: 'Advanced modules on conducting systematic reviews - the highest level of medical and scientific evidence.',
            level: 'Advanced',
            duration: '40+ hours',
            certificate: 'Cochrane Certificate',
            rating: 4.8,
            students: '25,000+',
            link: 'https://www.cochrane.org/learn/courses-and-resources/interactive-learning',
            topics: ['Systematic Reviews', 'Meta-Analysis', 'Evidence Synthesis', 'Literature Search', 'Quality Assessment'],
            skills: ['Evidence Synthesis', 'Critical Appraisal', 'Meta-Analysis', 'Literature Review'],
            prerequisites: 'Research methodology knowledge',
            outcomes: ['Conduct systematic reviews', 'Perform meta-analyses', 'Synthesize evidence', 'Contribute to evidence base']
          },
          {
            id: 'ds_004',
            title: 'Biomedical Literature & Research',
            provider: 'PubMed (NCBI)',
            description: 'Essential database for 35+ million biomedical citations. Learn to access and analyze scientific literature.',
            level: 'Intermediate',
            duration: 'Self-paced',
            certificate: 'Research Skills',
            rating: 4.6,
            students: '5,000,000+',
            link: 'https://pubmed.ncbi.nlm.nih.gov/',
            topics: ['Literature Search', 'Database Navigation', 'Research Analysis', 'Citation Management', 'Evidence Evaluation'],
            skills: ['Literature Search', 'Research Analysis', 'Critical Reading', 'Evidence Evaluation'],
            prerequisites: 'Basic research knowledge',
            outcomes: ['Master literature searches', 'Analyze research papers', 'Stay updated with research', 'Build evidence base']
          }
        ]
      },
      'Aptitude': {
        name: 'Aptitude & Professional Skills',
        description: 'Quantitative reasoning, interview preparation, and professional development',
        icon: '🧠',
        courses: [
          {
            id: 'apt_001',
            title: 'Quantitative Aptitude Mastery',
            provider: 'IndiaBIX',
            description: 'Industry standard platform with thousands of MCQs and detailed explanations for every aptitude topic.',
            level: 'Beginner to Advanced',
            duration: '80+ hours',
            certificate: 'Skill Certificates',
            rating: 4.7,
            students: '2,000,000+',
            link: 'https://www.indiabix.com/',
            topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation', 'Puzzles'],
            skills: ['Problem Solving', 'Logical Thinking', 'Mathematical Reasoning', 'Pattern Recognition'],
            prerequisites: 'Basic mathematics',
            outcomes: ['Excel in aptitude tests', 'Improve problem-solving', 'Crack competitive exams', 'Enhance logical thinking']
          },
          {
            id: 'apt_002',
            title: 'Comprehensive Aptitude Training',
            provider: 'CareerRide',
            description: 'Complete aptitude preparation with practice tests, mock interviews, and placement assistance.',
            level: 'Beginner to Advanced',
            duration: '60+ hours',
            certificate: 'Completion Certificate',
            rating: 4.6,
            students: '1,500,000+',
            link: 'https://www.careerride.com/',
            topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Technical Aptitude', 'Mock Tests'],
            skills: ['Analytical Thinking', 'Time Management', 'Test Strategy', 'Problem Solving'],
            prerequisites: 'Basic mathematics and English',
            outcomes: ['Master aptitude concepts', 'Improve test scores', 'Build confidence', 'Placement success']
          },
          {
            id: 'apt_003',
            title: 'Technical Aptitude & Programming',
            provider: 'GeeksforGeeks',
            description: 'Specifically designed for IT company placements with comprehensive technical preparation.',
            level: 'Intermediate to Advanced',
            duration: '100+ hours',
            certificate: 'Technical Certificates',
            rating: 4.8,
            students: '3,000,000+',
            link: 'https://www.geeksforgeeks.org/aptitude/aptitude-questions-and-answers/',
            topics: ['Data Structures', 'Algorithms', 'Programming', 'System Design', 'Technical Aptitude'],
            skills: ['Programming Skills', 'Algorithm Design', 'System Thinking', 'Technical Problem Solving'],
            prerequisites: 'Programming knowledge',
            outcomes: ['Crack technical interviews', 'Master algorithms', 'Solve coding problems', 'Get placed in top companies']
          },
          {
            id: 'apt_004',
            title: 'Video Learning - AK Agarwal Aptitude',
            provider: 'YouTube - AK Agarwal',
            description: 'Comprehensive video tutorials covering all aptitude topics with clear explanations and shortcuts.',
            level: 'Beginner to Intermediate',
            duration: '50+ hours',
            certificate: 'Self-paced Learning',
            rating: 4.5,
            students: '800,000+',
            link: 'https://www.youtube.com/results?search_query=ak+agarwal+aptitude+videos',
            topics: ['Quantitative Aptitude', 'Shortcuts & Tricks', 'Time & Work', 'Profit & Loss', 'Speed & Distance'],
            skills: ['Quick Calculation', 'Shortcut Methods', 'Time Management', 'Conceptual Understanding'],
            prerequisites: 'Basic mathematics',
            outcomes: ['Learn shortcut methods', 'Solve problems quickly', 'Build strong foundation', 'Improve accuracy']
          },
          {
            id: 'apt_005',
            title: 'Feel Free to Learn Aptitude',
            provider: 'YouTube - Feel Free to Learn',
            description: 'Easy-to-understand aptitude concepts with practical examples and problem-solving techniques.',
            level: 'Beginner',
            duration: '40+ hours',
            certificate: 'Self-paced Learning',
            rating: 4.4,
            students: '600,000+',
            link: 'https://www.youtube.com/results?search_query=feel+free+to+learn+aptitude',
            topics: ['Basic Aptitude', 'Number System', 'Percentage', 'Ratio & Proportion', 'Simple Interest'],
            skills: ['Fundamental Concepts', 'Step-by-step Problem Solving', 'Conceptual Clarity', 'Basic Calculations'],
            prerequisites: 'None - Beginner friendly',
            outcomes: ['Understand basic concepts', 'Build confidence', 'Solve fundamental problems', 'Prepare for advanced topics']
          },
          {
            id: 'apt_006',
            title: 'Presha Aptitude Classes',
            provider: 'YouTube - Prisha World',
            description: 'Structured aptitude classes with comprehensive coverage of all competitive exam topics.',
            level: 'Beginner to Advanced',
            duration: '70+ hours',
            certificate: 'Self-paced Learning',
            rating: 4.6,
            students: '900,000+',
            link: 'https://www.youtube.com/results?search_query=prisha+world+aptitude',
            topics: ['Complete Aptitude Syllabus', 'Competitive Exams', 'Banking Aptitude', 'SSC Preparation', 'Placement Tests'],
            skills: ['Comprehensive Problem Solving', 'Exam Strategy', 'Time Management', 'Accuracy Improvement'],
            prerequisites: 'Basic mathematics knowledge',
            outcomes: ['Master all aptitude topics', 'Crack competitive exams', 'Improve test performance', 'Build exam confidence']
          }
        ]
      },
      'Interview': {
        name: 'Interview Preparation & HR Skills',
        description: 'Behavioral questions, body language, confidence building, and professional interview skills',
        icon: '🎤',
        courses: [
          {
            id: 'int_001',
            title: 'AI-Powered Interview Practice',
            provider: 'Google Interview Warmup',
            description: 'AI-powered tool that lets you practice answering questions with speech transcription and improvement insights.',
            level: 'All Levels',
            duration: '20+ hours',
            certificate: 'Practice Completion',
            rating: 4.8,
            students: '2,000,000+',
            link: 'https://grow.google/grow-your-career/articles/interview-tips/',
            topics: ['Interview Questions', 'Speech Analysis', 'Vocabulary Building', 'Answer Structure', 'Communication Skills'],
            skills: ['Verbal Communication', 'Answer Structuring', 'Confidence Building', 'Professional Speaking'],
            prerequisites: 'None',
            outcomes: ['Improve speaking skills', 'Structure better answers', 'Build interview confidence', 'Get AI feedback']
          },
          {
            id: 'int_002',
            title: 'Peer-to-Peer Mock Interviews',
            provider: 'Pramp',
            description: '100% free peer-to-peer mock interviews. Get paired with someone else for mutual interview practice.',
            level: 'All Levels',
            duration: '30+ hours',
            certificate: 'Mock Interview Completion',
            rating: 4.7,
            students: '1,500,000+',
            link: 'https://www.pramp.com/#/',
            topics: ['Mock Interviews', 'Peer Learning', 'Real-time Feedback', 'Interview Simulation', 'Stage Fright Management'],
            skills: ['Interview Performance', 'Feedback Reception', 'Peer Learning', 'Confidence Building'],
            prerequisites: 'None',
            outcomes: ['Overcome stage fright', 'Practice real interviews', 'Get peer feedback', 'Build interview confidence']
          },
          {
            id: 'int_003',
            title: 'Professional Interview Skills',
            provider: 'Great Learning',
            description: 'Free courses on Interview Etiquettes, HR Interview Questions, and STAR Method for storytelling.',
            level: 'Beginner to Intermediate',
            duration: '25+ hours',
            certificate: 'Course Completion',
            rating: 4.6,
            students: '800,000+',
            link: 'https://www.greatlearning.in/',
            topics: ['Interview Etiquettes', 'HR Questions', 'STAR Method', 'Professional Behavior', 'Communication Skills'],
            skills: ['Professional Etiquette', 'Storytelling', 'Behavioral Responses', 'Professional Communication'],
            prerequisites: 'None',
            outcomes: ['Master interview etiquette', 'Learn STAR method', 'Handle HR questions', 'Professional presentation']
          },
          {
            id: 'int_004',
            title: 'Tell Me About Yourself Mastery',
            provider: 'Big Interview (YouTube)',
            description: 'The best channel for learning exactly what recruiters look for in the "Tell me about yourself" question.',
            level: 'All Levels',
            duration: '15+ hours',
            certificate: 'Self-paced Learning',
            rating: 4.9,
            students: '3,000,000+',
            link: 'https://www.youtube.com/@BigInterview',
            topics: ['Self Introduction', 'Personal Branding', 'Career Story', 'Professional Summary', 'First Impressions'],
            skills: ['Self Presentation', 'Personal Branding', 'Storytelling', 'Professional Communication'],
            prerequisites: 'None',
            outcomes: ['Perfect self-introduction', 'Create compelling career story', 'Make great first impression', 'Build personal brand']
          }
        ]
      }
    };
  }

  getCoursesByDomain(domain) {
    return this.courses[domain] || null;
  }

  getAllCourses() {
    return this.courses;
  }

  getCourseById(courseId) {
    for (const domain in this.courses) {
      const course = this.courses[domain].courses.find(c => c.id === courseId);
      if (course) {
        return { ...course, domain };
      }
    }
    return null;
  }

  searchCourses(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const domain in this.courses) {
      this.courses[domain].courses.forEach(course => {
        if (
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.topics.some(topic => topic.toLowerCase().includes(searchTerm)) ||
          course.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        ) {
          results.push({ ...course, domain });
        }
      });
    }

    return results;
  }

  getRecommendedCourses(userProfile) {
    const { selectedDomain, currentLevel, interests = [], goals = [] } = userProfile;
    
    if (!selectedDomain || !this.courses[selectedDomain]) {
      return [];
    }

    const domainCourses = this.courses[selectedDomain].courses;
    
    // Filter courses based on user level and interests
    return domainCourses.filter(course => {
      const levelMatch = this.matchesUserLevel(course.level, currentLevel);
      const interestMatch = interests.length === 0 || 
        course.topics.some(topic => 
          interests.some(interest => 
            topic.toLowerCase().includes(interest.toLowerCase())
          )
        );
      
      return levelMatch && interestMatch;
    }).sort((a, b) => b.rating - a.rating);
  }

  matchesUserLevel(courseLevel, userLevel) {
    const levelMap = {
      'Beginner': 1,
      'Beginner to Intermediate': 1.5,
      'Intermediate': 2,
      'Intermediate to Advanced': 2.5,
      'Advanced': 3,
      'Professional': 3.5,
      'All Levels': 0
    };

    const courseLevelNum = levelMap[courseLevel] || 0;
    const userLevelNum = userLevel || 1;

    // Allow courses at user's level or slightly above
    return courseLevelNum === 0 || courseLevelNum <= userLevelNum + 1;
  }

  getCourseStats() {
    const stats = {
      totalCourses: 0,
      totalStudents: 0,
      averageRating: 0,
      domainCounts: {}
    };

    let totalRating = 0;
    let totalStudentsNum = 0;

    for (const domain in this.courses) {
      const domainData = this.courses[domain];
      stats.domainCounts[domain] = domainData.courses.length;
      stats.totalCourses += domainData.courses.length;

      domainData.courses.forEach(course => {
        totalRating += course.rating;
        // Convert student count string to number
        const studentCount = parseInt(course.students.replace(/[^0-9]/g, '')) || 0;
        totalStudentsNum += studentCount;
      });
    }

    stats.averageRating = totalRating / stats.totalCourses;
    stats.totalStudents = totalStudentsNum;

    return stats;
  }
}

module.exports = CourseDatabase;