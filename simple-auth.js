// Simple in-memory user storage for testing
let users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@careerpath.com',
    password: '$2a$12$3evvr240AwOGJsUajphvju2buKPSzbsJ1PNRQPPfXpzu8KSZJMrbu', // demo123
    selectedDomain: 'IT',
    progress: {
      currentLevel: 2,
      completedCourses: [],
      completionPercentage: 25,
      quizScores: [],
      IT: { currentLevel: 1, unlockedLevels: [1] },
      DataScience: { currentLevel: 1, unlockedLevels: [1] },
      Healthcare: { currentLevel: 1, unlockedLevels: [1] },
      Finance: { currentLevel: 1, unlockedLevels: [1] },
      Aptitude: { currentLevel: 1, unlockedLevels: [1] },
      Interview: { currentLevel: 1, unlockedLevels: [1] }
    },
    achievements: [
      {
        title: 'Welcome Aboard!',
        description: 'Successfully created your account',
        earnedAt: new Date(),
        badgeIcon: 'star'
      }
    ]
  }
];

let courses = [
  {
    id: '1',
    title: 'HTML & CSS Fundamentals',
    description: 'Learn the building blocks of web development with HTML and CSS',
    domain: 'IT',
    level: 'Beginner',
    levelNumber: 1,
    duration: '4 weeks',
    skills: ['HTML', 'CSS', 'Web Design', 'Responsive Design'],
    resources: [
      {
        title: 'freeCodeCamp',
        description: 'The gold standard for free IT learning. 3,000+ hours of curriculum covering Responsive Web Design, JavaScript, Machine Learning, and Cybersecurity.',
        type: 'platform',
        url: 'https://www.freecodecamp.org/',
        platform: 'freeCodeCamp',
        isFree: true,
        rating: 5,
        certificate: 'Free'
      },
      {
        title: 'The Odin Project',
        description: 'Best for becoming a Full-Stack Developer. Open-source, project-based curriculum that mimics real-world workflow.',
        type: 'platform',
        url: 'https://www.theodinproject.com/',
        platform: 'The Odin Project',
        isFree: true,
        rating: 5,
        certificate: 'Free'
      },
      {
        title: 'MDN Web Docs',
        description: 'The "Encyclopedia" of the web. Essential for advanced learners to understand deep technical documentation.',
        type: 'documentation',
        url: 'https://developer.mozilla.org/en-US/',
        platform: 'MDN',
        isFree: true,
        rating: 5,
        certificate: 'N/A'
      }
    ],
    estimatedHours: 40,
    difficulty: 3,
    tags: ['web-development', 'frontend', 'beginner'],
    isLocked: false
  },
  {
    id: '2',
    title: 'JavaScript Essentials',
    description: 'Master JavaScript fundamentals and modern ES6+ features',
    domain: 'IT',
    level: 'Beginner',
    levelNumber: 2,
    duration: '6 weeks',
    skills: ['JavaScript', 'ES6+', 'DOM Manipulation', 'Async Programming'],
    resources: [
      {
        title: 'JavaScript Tutorial - MDN',
        type: 'documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        platform: 'MDN',
        isFree: true,
        description: 'Comprehensive JavaScript documentation and guides'
      },
      {
        title: 'freeCodeCamp JavaScript',
        type: 'practice',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        platform: 'freeCodeCamp',
        isFree: true,
        description: 'Interactive JavaScript curriculum with projects'
      }
    ],
    estimatedHours: 60,
    difficulty: 4,
    tags: ['javascript', 'programming', 'frontend'],
    isLocked: true
  },
  {
    id: '3',
    title: 'React Development',
    description: 'Build modern user interfaces with React.js',
    domain: 'IT',
    level: 'Intermediate',
    levelNumber: 3,
    duration: '8 weeks',
    skills: ['React', 'JSX', 'Components', 'State Management', 'Hooks'],
    resources: [
      {
        title: 'React Official Documentation',
        type: 'documentation',
        url: 'https://reactjs.org/docs/getting-started.html',
        platform: 'React',
        isFree: true,
        description: 'Official React documentation with tutorials and guides'
      }
    ],
    estimatedHours: 80,
    difficulty: 6,
    tags: ['react', 'frontend', 'javascript', 'library'],
    isLocked: true
  }
];

// Domain data with comprehensive learning resources
let domains = [
  {
    id: 'IT',
    name: 'Information Technology & Web Development',
    description: 'Software development, web development, cybersecurity, and cloud computing',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    resources: [
      {
        title: 'freeCodeCamp',
        description: 'The gold standard for free IT learning. 3,000+ hours of curriculum covering Responsive Web Design, JavaScript, Machine Learning, and Cybersecurity.',
        url: 'https://www.freecodecamp.org/',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Complete Curriculum',
        certificate: 'Free'
      },
      {
        title: 'The Odin Project',
        description: 'Best for becoming a Full-Stack Developer. Open-source, project-based curriculum that mimics real-world workflow.',
        url: 'https://www.theodinproject.com/',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Full-Stack Development',
        certificate: 'Free'
      },
      {
        title: 'Harvard CS50 (via edX)',
        description: 'Arguably the best "Introduction to Computer Science" course in the world. You can audit the entire course for free.',
        url: 'https://www.edx.org/cs50',
        type: 'course',
        isFree: true,
        rating: 5,
        category: 'Computer Science',
        certificate: 'Free Audit'
      },
      {
        title: 'MDN Web Docs',
        description: 'The "Encyclopedia" of the web. Essential for advanced learners to understand deep technical documentation.',
        url: 'https://developer.mozilla.org/en-US/',
        type: 'documentation',
        isFree: true,
        rating: 5,
        category: 'Reference',
        certificate: 'N/A'
      }
    ]
  },
  {
    id: 'Finance',
    name: 'Finance & Accounting',
    description: 'Financial literacy, corporate finance, and market analysis',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    resources: [
      {
        title: 'Corporate Finance Institute (CFI) Free Courses',
        description: 'Offers excellent free introductory courses on Financial Modeling, Excel, and Accounting.',
        url: 'https://help.corporatefinanceinstitute.com/article/1184-the-cfi-career-map',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Financial Modeling',
        certificate: 'Free'
      },
      {
        title: 'Khan Academy (Finance & Capital Markets)',
        description: 'Best for beginners to understand interest, stocks, bonds, and macroeconomics.',
        url: 'https://www.khanacademy.org/economics-finance-domain',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Finance Fundamentals',
        certificate: 'Free'
      },
      {
        title: 'Investopedia Academy',
        description: 'Vast library of articles and "Financial Term of the Day" - best free resource for market terminology.',
        url: 'https://www.investopedia.com/',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'Market Knowledge',
        certificate: 'Mixed'
      }
    ]
  },
  {
    id: 'Healthcare',
    name: 'Healthcare & Life Sciences',
    description: 'Medical professionals, students, and public health enthusiasts',
    icon: '🏥',
    color: 'from-red-500 to-pink-500',
    resources: [
      {
        title: 'Stanford Medicine Online',
        description: 'Massive list of free CME courses and webinars with free certificates.',
        url: 'https://med.stanford.edu/spectrum/education-and-training/research-career-accelerator-program.html',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Medical Education',
        certificate: 'Free CME'
      },
      {
        title: 'WHO Open Learning',
        description: 'World Health Organization platform for epidemics, health emergencies, and public health management.',
        url: 'https://openwho.org/',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Public Health',
        certificate: 'Free'
      },
      {
        title: 'NextGenU',
        description: 'Free, accredited-equivalent courses in nursing, community health, and preventive medicine.',
        url: 'https://nextgenu.org/',
        type: 'platform',
        isFree: true,
        rating: 4.7,
        category: 'Nursing & Community Health',
        certificate: 'Free Accredited'
      }
    ]
  },
  {
    id: 'DataScience',
    name: 'Data Science & Analytics',
    description: 'Data analysis, machine learning, and research methodology',
    icon: '📊',
    color: 'from-purple-500 to-indigo-500',
    resources: [
      {
        title: 'AuthorAID',
        description: 'Global network providing free courses in research writing, grant proposal writing, and statistical analysis.',
        url: 'https://www.authoraid.info/',
        type: 'platform',
        isFree: true,
        rating: 4.5,
        category: 'Research Methods',
        certificate: 'Free'
      },
      {
        title: 'NCRM (National Centre for Research Methods)',
        description: 'Over 100 free tutorials on "Qualitative Research" and "Statistical Modelling" for advanced researchers.',
        url: 'https://www.ncrm.ac.uk/resources/online/',
        type: 'platform',
        isFree: true,
        rating: 4.7,
        category: 'Advanced Research',
        certificate: 'Free'
      },
      {
        title: 'Cochrane Interactive Learning',
        description: 'Advanced modules on conducting systematic reviews - the highest level of medical and scientific evidence.',
        url: 'https://www.cochrane.org/learn/courses-and-resources/interactive-learning',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'Evidence Synthesis',
        certificate: 'Free'
      }
    ]
  },
  {
    id: 'Aptitude',
    name: 'Aptitude & Professional Skills',
    description: 'Quantitative reasoning, interview preparation, and professional development',
    icon: '🧠',
    color: 'from-orange-500 to-yellow-500',
    resources: [
      {
        title: 'IndiaBIX',
        description: 'Industry standard platform with thousands of MCQs and detailed explanations for every aptitude topic.',
        url: 'https://www.indiabix.com/',
        type: 'platform',
        isFree: true,
        rating: 4.7,
        category: 'Quantitative Aptitude',
        certificate: 'Free'
      },
      {
        title: 'GeeksforGeeks (Aptitude)',
        description: 'Specifically designed for IT company placements (TCS, Infosys, Google). Comprehensive technical preparation.',
        url: 'https://www.geeksforgeeks.org/questions/aptitude/',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'Technical Aptitude',
        certificate: 'Free'
      },
      {
        title: 'Assessment Day',
        description: 'Free practice for inductive, deductive, and situational judgment tests used by employers.',
        url: 'https://www.assessmentday.co.uk/',
        type: 'platform',
        isFree: true,
        rating: 4.5,
        category: 'Psychometric Tests',
        certificate: 'Free'
      }
    ]
  },
  {
    id: 'Interview',
    name: 'Interview Preparation & HR Skills',
    description: 'Behavioral questions, body language, confidence building, and professional interview skills',
    icon: '🎤',
    color: 'from-pink-500 to-rose-500',
    resources: [
      {
        title: 'Google Interview Warmup',
        description: 'AI-powered tool that lets you practice answering questions with speech transcription and improvement insights.',
        url: 'https://grow.google/grow-your-career/articles/interview-tips/',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'AI Interview Practice',
        certificate: 'Free'
      },
      {
        title: 'Pramp',
        description: '100% free peer-to-peer mock interviews. Get paired with someone else for mutual interview practice.',
        url: 'https://www.pramp.com/#/',
        type: 'platform',
        isFree: true,
        rating: 4.7,
        category: 'Mock Interviews',
        certificate: 'Free'
      },
      {
        title: 'Big Interview (YouTube)',
        description: 'The best channel for learning exactly what recruiters look for in the "Tell me about yourself" question.',
        url: 'https://www.youtube.com/@BigInterview',
        type: 'video',
        isFree: true,
        rating: 4.9,
        category: 'Interview Techniques',
        certificate: 'Free'
      }
    ]
  }
];

// Enhanced Aptitude and Interview Resources with User-Provided Links
let aptitudeResources = [
  {
    title: 'IndiaBIX',
    description: 'The Industry Standard. Thousands of MCQs with detailed explanations for every aptitude topic including quantitative, logical reasoning, and verbal ability.',
    url: 'https://www.indiabix.com/',
    type: 'platform',
    level: 'Beginner to Pro',
    isFree: true,
    rating: 4.8,
    category: 'Quantitative Aptitude',
    topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
    provider: 'IndiaBIX'
  },
  {
    title: 'CareerRide',
    description: 'Comprehensive aptitude preparation platform with practice tests, mock exams, and detailed solutions for competitive exams.',
    url: 'https://www.careerride.com/',
    type: 'platform',
    level: 'Beginner to Advanced',
    isFree: true,
    rating: 4.6,
    category: 'Competitive Exams',
    topics: ['Aptitude Tests', 'Mock Exams', 'Competitive Preparation', 'Practice Tests'],
    provider: 'CareerRide'
  },
  {
    title: 'GeeksforGeeks Aptitude',
    description: 'Technical Placements. Specifically designed for IT company placements (TCS, Infosys, Google) with comprehensive aptitude questions and answers.',
    url: 'https://www.geeksforgeeks.org/aptitude/aptitude-questions-and-answers/',
    type: 'platform',
    level: 'Intermediate to Advanced',
    isFree: true,
    rating: 4.8,
    category: 'Technical Aptitude',
    topics: ['Technical Aptitude', 'Programming Logic', 'Mathematical Reasoning', 'Problem Solving'],
    provider: 'GeeksforGeeks'
  },
  {
    title: 'AK Agarwal Aptitude (YouTube)',
    description: 'Popular YouTube channel with comprehensive video tutorials on quantitative aptitude, shortcuts, and problem-solving techniques.',
    url: 'https://www.youtube.com/results?search_query=ak+agarwal+aptitude+videos',
    type: 'video',
    level: 'Beginner to Intermediate',
    isFree: true,
    rating: 4.7,
    category: 'Video Tutorials',
    topics: ['Quantitative Shortcuts', 'Problem Solving', 'Mathematical Tricks', 'Speed Calculation'],
    provider: 'YouTube'
  },
  {
    title: 'Feel Free to Learn Aptitude (YouTube)',
    description: 'Excellent YouTube channel focusing on aptitude concepts with clear explanations and practice problems for competitive exams.',
    url: 'https://www.youtube.com/results?search_query=feel+free+to+learn+aptitude',
    type: 'video',
    level: 'Beginner to Intermediate',
    isFree: true,
    rating: 4.5,
    category: 'Educational Videos',
    topics: ['Aptitude Concepts', 'Logical Reasoning', 'Mathematical Aptitude', 'Exam Preparation'],
    provider: 'YouTube'
  },
  {
    title: 'Presha Aptitude Classes (YouTube)',
    description: 'Specialized YouTube channel for aptitude preparation with structured lessons and practice sessions for various competitive exams.',
    url: 'https://www.youtube.com/results?search_query=prisha+world+aptitude',
    type: 'video',
    level: 'All Levels',
    isFree: true,
    rating: 4.4,
    category: 'Structured Learning',
    topics: ['Structured Aptitude', 'Competitive Exams', 'Practice Sessions', 'Concept Building'],
    provider: 'YouTube'
  }
];

let interviewResources = [
  {
    title: 'Google Interview Warmup',
    description: 'AI-powered tool that lets you practice answering questions. It transcribes your speech and gives you insights on how to improve your vocabulary and structure.',
    url: 'https://grow.google/grow-your-career/articles/interview-tips/',
    type: 'tool',
    level: 'All Levels',
    isFree: true,
    rating: 4.8,
    category: 'AI Interview Practice',
    topics: ['AI Practice', 'Speech Analysis', 'Interview Skills', 'Vocabulary Building'],
    provider: 'Google'
  },
  {
    title: 'Pramp',
    description: '100% free peer-to-peer mock interviews. You get paired with someone else, you interview them, and they interview you. Great for overcoming "stage fright."',
    url: 'https://www.pramp.com/#/',
    type: 'platform',
    level: 'All Levels',
    isFree: true,
    rating: 4.7,
    category: 'Mock Interviews',
    topics: ['Peer Interviews', 'Mock Practice', 'Stage Fright', 'Real Interview Experience'],
    provider: 'Pramp'
  },
  {
    title: 'Great Learning Interview Prep',
    description: 'Free courses on "Interview Etiquettes," "HR Interview Questions," and "STAR Method" for storytelling in behavioral interviews.',
    url: 'https://www.mygreatlearning.com/academy/learn-for-free/courses/interview-preparation',
    type: 'course',
    level: 'Beginner to Intermediate',
    isFree: true,
    rating: 4.6,
    category: 'Interview Skills',
    topics: ['Interview Etiquettes', 'HR Questions', 'STAR Method', 'Behavioral Interviews'],
    provider: 'Great Learning'
  },
  {
    title: 'Big Interview (YouTube)',
    description: 'The best channel for learning exactly what a recruiter is looking for when they say "Tell me about yourself." Professional interview coaching content.',
    url: 'https://www.youtube.com/@BigInterview',
    type: 'video',
    level: 'All Levels',
    isFree: true,
    rating: 4.9,
    category: 'Interview Techniques',
    topics: ['Tell Me About Yourself', 'Recruiter Insights', 'Interview Coaching', 'Professional Tips'],
    provider: 'Big Interview'
  }
];

module.exports = { 
  users, 
  courses, 
  domains, 
  aptitudeResources, 
  interviewResources 
};