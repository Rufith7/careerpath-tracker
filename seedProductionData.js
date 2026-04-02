const mongoose = require('mongoose');
const User = require('./models/User');
const Domain = require('./models/Domain');
require('dotenv').config();

// Comprehensive domain data with all learning resources you provided
const domainData = [
  {
    name: 'IT',
    displayName: 'Information Technology & Web Development',
    description: 'Software development, web development, cybersecurity, and cloud computing',
    icon: 'code',
    color: '#3b82f6',
    marketTrends: {
      growth: 'High',
      demand: 'High',
      averageSalary: 95000,
      jobOpenings: 500000,
      topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker']
    },
    careerPaths: [
      {
        title: 'Full Stack Web Developer',
        description: 'Build complete web applications from frontend to backend',
        averageSalary: { entry: 65000, mid: 85000, senior: 120000, currency: 'USD' },
        jobTitles: ['Full Stack Developer', 'Web Developer', 'Software Engineer'],
        companies: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Netflix'],
        totalEstimatedHours: 300,
        difficulty: 'Intermediate'
      }
    ],
    resources: [
      {
        title: 'freeCodeCamp',
        description: 'The gold standard for free IT learning. It offers 3,000+ hours of curriculum covering Responsive Web Design, JavaScript, Machine Learning, and Cybersecurity.',
        url: 'https://www.freecodecamp.org/',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Complete Curriculum',
        certificate: 'Free'
      },
      {
        title: 'The Odin Project',
        description: 'Best for becoming a Full-Stack Developer. It\'s an open-source, project-based curriculum that mimics a real-world workflow.',
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
    name: 'Finance',
    displayName: 'Finance & Accounting',
    description: 'Financial literacy, corporate finance, and market analysis',
    icon: 'dollar-sign',
    color: '#10b981',
    marketTrends: {
      growth: 'Medium',
      demand: 'High',
      averageSalary: 85000,
      jobOpenings: 200000,
      topSkills: ['Financial Analysis', 'Excel', 'Python', 'SQL', 'Risk Management']
    },
    careerPaths: [
      {
        title: 'Financial Analyst',
        description: 'Analyze financial data and market trends to guide investment decisions',
        averageSalary: { entry: 55000, mid: 75000, senior: 100000, currency: 'USD' },
        jobTitles: ['Financial Analyst', 'Investment Analyst', 'Research Analyst'],
        companies: ['Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'BlackRock'],
        totalEstimatedHours: 250,
        difficulty: 'Intermediate'
      }
    ],
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
        description: 'While some courses are paid, their vast library of articles and "Financial Term of the Day" is the best free resource for market terminology.',
        url: 'https://www.investopedia.com/',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'Market Knowledge',
        certificate: 'Mixed'
      },
      {
        title: 'UN SDG Academy',
        description: 'For advanced learners interested in "Sustainable Finance" and global economic development.',
        url: 'https://sdgacademy.org/',
        type: 'platform',
        isFree: true,
        rating: 4.5,
        category: 'Sustainable Finance',
        certificate: 'Free'
      }
    ]
  },
  {
    name: 'Healthcare',
    displayName: 'Healthcare & Life Sciences',
    description: 'Medical professionals, students, and public health enthusiasts',
    icon: 'heart',
    color: '#ef4444',
    marketTrends: {
      growth: 'High',
      demand: 'High',
      averageSalary: 75000,
      jobOpenings: 300000,
      topSkills: ['Patient Care', 'Medical Knowledge', 'Healthcare IT', 'Communication']
    },
    careerPaths: [
      {
        title: 'Healthcare Administrator',
        description: 'Manage healthcare facilities and coordinate patient care',
        averageSalary: { entry: 50000, mid: 70000, senior: 95000, currency: 'USD' },
        jobTitles: ['Healthcare Administrator', 'Hospital Manager', 'Clinical Manager'],
        companies: ['Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'Kaiser Permanente'],
        totalEstimatedHours: 280,
        difficulty: 'Intermediate'
      }
    ],
    resources: [
      {
        title: 'Stanford Medicine Online',
        description: 'Stanford offers a massive list of free CME (Continuing Medical Education) courses and webinars with free certificates.',
        url: 'https://med.stanford.edu/spectrum/education-and-training/research-career-accelerator-program.html',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Medical Education',
        certificate: 'Free CME'
      },
      {
        title: 'WHO Open Learning',
        description: 'The World Health Organization\'s platform for learning about epidemics, health emergencies, and public health management.',
        url: 'https://openwho.org/',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Public Health',
        certificate: 'Free'
      },
      {
        title: 'NextGenU',
        description: 'Offers free, accredited-equivalent courses in nursing, community health, and preventive medicine.',
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
    name: 'Research',
    displayName: 'Research & Academic Methodology',
    description: 'Learning how to conduct, write, and publish scientific research',
    icon: 'book',
    color: '#8b5cf6',
    marketTrends: {
      growth: 'Medium',
      demand: 'Medium',
      averageSalary: 70000,
      jobOpenings: 150000,
      topSkills: ['Research Methods', 'Statistical Analysis', 'Academic Writing', 'Data Analysis']
    },
    careerPaths: [
      {
        title: 'Research Scientist',
        description: 'Conduct scientific research and publish findings',
        averageSalary: { entry: 55000, mid: 75000, senior: 110000, currency: 'USD' },
        jobTitles: ['Research Scientist', 'Research Associate', 'Principal Investigator'],
        companies: ['Universities', 'Research Institutes', 'Pharmaceutical Companies', 'Government Labs'],
        totalEstimatedHours: 320,
        difficulty: 'Advanced'
      }
    ],
    resources: [
      {
        title: 'AuthorAID',
        description: 'A global network that provides free online courses in research writing, grant proposal writing, and statistical analysis.',
        url: 'https://risingscholars.net/',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'Research Writing',
        certificate: 'Free'
      },
      {
        title: 'NCRM (National Centre for Research Methods)',
        description: 'Provides over 100 free tutorials on advanced topics like "Qualitative Research" and "Statistical Modelling."',
        url: 'https://www.ncrm.ac.uk/resources/online/',
        type: 'platform',
        isFree: true,
        rating: 4.6,
        category: 'Research Methods',
        certificate: 'Free'
      },
      {
        title: 'Cochrane Interactive Learning',
        description: 'Advanced modules on how to conduct systematic reviews (often used in healthcare and social sciences).',
        url: 'https://www.cochrane.org/learn/courses-and-resources/interactive-learning',
        type: 'platform',
        isFree: true,
        rating: 4.7,
        category: 'Systematic Reviews',
        certificate: 'Free'
      }
    ]
  },
  {
    name: 'Management',
    displayName: 'Private Sector (Management & Soft Skills)',
    description: 'Skills for HR, Sales, Marketing, and Operations',
    icon: 'users',
    color: '#f59e0b',
    marketTrends: {
      growth: 'Medium',
      demand: 'High',
      averageSalary: 80000,
      jobOpenings: 250000,
      topSkills: ['Leadership', 'Project Management', 'Digital Marketing', 'Sales', 'HR Management']
    },
    careerPaths: [
      {
        title: 'Digital Marketing Manager',
        description: 'Lead digital marketing campaigns and strategies',
        averageSalary: { entry: 50000, mid: 70000, senior: 95000, currency: 'USD' },
        jobTitles: ['Digital Marketing Manager', 'Marketing Specialist', 'SEO Manager'],
        companies: ['Google', 'Facebook', 'HubSpot', 'Salesforce', 'Adobe'],
        totalEstimatedHours: 200,
        difficulty: 'Intermediate'
      }
    ],
    resources: [
      {
        title: 'HubSpot Academy',
        description: 'The best place for Digital Marketing, SEO, and Sales training.',
        url: 'https://academy.hubspot.com/',
        type: 'platform',
        isFree: true,
        rating: 5,
        category: 'Digital Marketing',
        certificate: 'Free'
      },
      {
        title: 'Oxford Home Study Centre',
        description: 'Offers short free courses in HR Management, Project Management, and Business Studies.',
        url: 'https://www.oxfordhomestudy.com/free-online-courses-with-certificates',
        type: 'platform',
        isFree: true,
        rating: 4.3,
        category: 'Business Management',
        certificate: 'Free'
      },
      {
        title: 'Google Skillshop',
        description: 'Official training for Google Ads, Analytics, and Business Profile—essential for any private sector marketing role.',
        url: 'https://skillshop.withgoogle.com/',
        type: 'platform',
        isFree: true,
        rating: 4.8,
        category: 'Google Marketing Tools',
        certificate: 'Free'
      }
    ]
  },
  {
    name: 'Construction',
    displayName: 'Construction & Real Estate Management',
    description: 'Property laws, project finance, and site management',
    icon: 'home',
    color: '#dc2626',
    marketTrends: {
      growth: 'Medium',
      demand: 'Medium',
      averageSalary: 75000,
      jobOpenings: 180000,
      topSkills: ['Project Management', 'Construction Technology', 'Real Estate Law', 'Site Management']
    },
    careerPaths: [
      {
        title: 'Construction Project Manager',
        description: 'Oversee construction projects from planning to completion',
        averageSalary: { entry: 55000, mid: 75000, senior: 100000, currency: 'USD' },
        jobTitles: ['Project Manager', 'Site Manager', 'Construction Supervisor'],
        companies: ['Bechtel', 'Turner Construction', 'Skanska', 'AECOM'],
        totalEstimatedHours: 240,
        difficulty: 'Intermediate'
      }
    ],
    resources: [
      {
        title: 'Columbia University Construction Management (via Coursera)',
        description: 'A top-tier specialization. You can Audit all courses for free to learn scheduling, estimating, and finance.',
        url: 'https://www.coursera.org/specializations/construction-management',
        type: 'course',
        isFree: true,
        rating: 4.6,
        category: 'Construction Management',
        certificate: 'Free Audit'
      },
      {
        title: 'Indian Real Estate Fundamentals (Rohit Gaikwad)',
        description: 'Excellent for understanding regional property laws, RERA acts, and brokerage basics.',
        url: 'https://www.sell.do/blog/free-online-real-estate-courses-with-certificates-in-india',
        type: 'course',
        isFree: true,
        rating: 4.2,
        category: 'Real Estate',
        certificate: 'Free'
      },
      {
        title: 'The Engineering Mindset (YouTube)',
        description: 'While technical, it\'s perfect for understanding building systems (HVAC, Electrical) essential for property managers.',
        url: 'https://www.youtube.com/c/Theengineeringmindset',
        type: 'video',
        isFree: true,
        rating: 4.7,
        category: 'Building Systems',
        certificate: 'N/A'
      },
      {
        title: 'GrabCAD',
        description: 'Use this open-source community to view BIM (Building Information Modeling) and architectural files.',
        url: 'https://grabcad.com/',
        type: 'platform',
        isFree: true,
        rating: 4.4,
        category: 'BIM & CAD',
        certificate: 'N/A'
      }
    ]
  },
  {
    name: 'Logistics',
    displayName: 'Logistics & Supply Chain Management',
    description: 'Global trade, inventory control, and transport optimization',
    icon: 'truck',
    color: '#059669',
    marketTrends: {
      growth: 'High',
      demand: 'High',
      averageSalary: 70000,
      jobOpenings: 220000,
      topSkills: ['Supply Chain Management', 'Logistics Planning', 'Inventory Control', 'Data Analysis']
    },
    careerPaths: [
      {
        title: 'Supply Chain Manager',
        description: 'Optimize supply chain operations and logistics',
        averageSalary: { entry: 50000, mid: 70000, senior: 95000, currency: 'USD' },
        jobTitles: ['Supply Chain Manager', 'Logistics Coordinator', 'Operations Manager'],
        companies: ['Amazon', 'FedEx', 'UPS', 'DHL', 'Walmart'],
        totalEstimatedHours: 220,
        difficulty: 'Intermediate'
      }
    ],
    resources: [
      {
        title: 'Alison: Mastering Supply Chain & Logistics',
        description: 'A comprehensive certificate course covering the "Six Rights" of logistics and SWOT analysis.',
        url: 'https://alison.com/course/mastering-supply-chain-and-logistics-management',
        type: 'course',
        isFree: true,
        rating: 4.5,
        category: 'Supply Chain Fundamentals',
        certificate: 'Free'
      },
      {
        title: 'MIT OpenCourseWare: Logistics Systems',
        description: 'Advanced graduate-level materials for those wanting to master the math behind global shipping.',
        url: 'https://ocw.mit.edu/courses/1-270-logistics-systems-fall-2005/',
        type: 'course',
        isFree: true,
        rating: 4.8,
        category: 'Advanced Logistics',
        certificate: 'Free'
      },
      {
        title: 'Supply Chain Now (YouTube)',
        description: 'Features interviews with industry pros to understand real-world private sector trends.',
        url: 'https://www.youtube.com/@SupplyChainNow',
        type: 'video',
        isFree: true,
        rating: 4.3,
        category: 'Industry Insights',
        certificate: 'N/A'
      },
      {
        title: 'SCOR Model Reference',
        description: 'The open standard for supply chain excellence used by Fortune 500 companies.',
        url: 'https://www.ascm.org/',
        type: 'documentation',
        isFree: true,
        rating: 4.6,
        category: 'Industry Standards',
        certificate: 'N/A'
      }
    ]
  },
  {
    name: 'Creative',
    displayName: 'Creative Arts & Media Production',
    description: 'Graphic design, filmmaking, and digital content strategy',
    icon: 'palette',
    color: '#ec4899',
    marketTrends: {
      growth: 'Medium',
      demand: 'Medium',
      averageSalary: 60000,
      jobOpenings: 160000,
      topSkills: ['Graphic Design', 'Video Editing', 'UI/UX Design', 'Content Creation']
    },
    careerPaths: [
      {
        title: 'UI/UX Designer',
        description: 'Design user interfaces and experiences for digital products',
        averageSalary: { entry: 45000, mid: 65000, senior: 90000, currency: 'USD' },
        jobTitles: ['UI Designer', 'UX Designer', 'Product Designer'],
        companies: ['Adobe', 'Figma', 'Airbnb', 'Uber', 'Netflix'],
        totalEstimatedHours: 200,
        difficulty: 'Intermediate'
      }
    ],
    resources: [
      {
        title: 'Adobe Learn',
        description: 'Thousands of free tutorials for Photoshop, Premiere, and Illustrator directly from the source.',
        url: 'https://www.adobe.com/uk/learn/photoshop',
        type: 'platform',
        isFree: true,
        rating: 4.7,
        category: 'Adobe Creative Suite',
        certificate: 'N/A'
      },
      {
        title: 'Cursa.app',
        description: 'A massive library of free courses on UI/UX, 3D modeling (Blender), and photography.',
        url: 'https://cursa.app/en/free-online-art-and-design-en-courses',
        type: 'platform',
        isFree: true,
        rating: 4.4,
        category: 'Design & Art',
        certificate: 'Free'
      },
      {
        title: 'Filmmaker IQ (YouTube)',
        description: 'Goes deep into the history and science of cinema—perfect for moving from a hobbyist to a pro.',
        url: 'https://www.youtube.com/@FilmmakerIQ',
        type: 'video',
        isFree: true,
        rating: 4.8,
        category: 'Filmmaking',
        certificate: 'N/A'
      },
      {
        title: 'Unsplash',
        description: 'The leading open-source library for high-resolution, commercial-use images for your projects.',
        url: 'https://unsplash.com/',
        type: 'resource',
        isFree: true,
        rating: 4.9,
        category: 'Stock Photos',
        certificate: 'N/A'
      }
    ]
  },
  {
    name: 'Aviation',
    displayName: 'Aviation & Aerospace Industry',
    description: 'Aircraft maintenance, flight mechanics, and airport operations',
    icon: 'plane',
    color: '#0ea5e9',
    marketTrends: {
      growth: 'Medium',
      demand: 'Medium',
      averageSalary: 85000,
      jobOpenings: 120000,
      topSkills: ['Aircraft Maintenance', 'Flight Operations', 'Safety Management', 'Aerospace Engineering']
    },
    careerPaths: [
      {
        title: 'Aircraft Maintenance Technician',
        description: 'Maintain and repair aircraft systems and components',
        averageSalary: { entry: 50000, mid: 70000, senior: 90000, currency: 'USD' },
        jobTitles: ['Aircraft Mechanic', 'Avionics Technician', 'Maintenance Engineer'],
        companies: ['Boeing', 'Airbus', 'Delta Airlines', 'American Airlines', 'Southwest'],
        totalEstimatedHours: 260,
        difficulty: 'Advanced'
      }
    ],
    resources: [
      {
        title: 'Embry-Riddle MOOCs',
        description: 'The "Harvard of Aviation" offers free courses on aircraft maintenance, safety, and human factors.',
        url: 'https://worldwide.erau.edu/massive-open-online-courses',
        type: 'course',
        isFree: true,
        rating: 4.8,
        category: 'Aviation Education',
        certificate: 'Free'
      },
      {
        title: 'Fundamentals of Flight Mechanics (Coursera)',
        description: 'Use "Audit" mode to learn the physics of how planes and rockets actually stay in the air.',
        url: 'https://www.coursera.org/learn/flight-mechanics',
        type: 'course',
        isFree: true,
        rating: 4.6,
        category: 'Flight Mechanics',
        certificate: 'Free Audit'
      },
      {
        title: 'Mentour Pilot (YouTube)',
        description: 'Detailed breakdowns of flight operations and cockpit procedures for a "Pro" level understanding.',
        url: 'https://www.youtube.com/@MentourPilot',
        type: 'video',
        isFree: true,
        rating: 4.9,
        category: 'Flight Operations',
        certificate: 'N/A'
      }
    ]
  },
  {
    name: 'Energy',
    displayName: 'Renewable Energy & Sustainability',
    description: 'Solar/Wind technology, carbon accounting, and green business',
    icon: 'leaf',
    color: '#22c55e',
    marketTrends: {
      growth: 'High',
      demand: 'High',
      averageSalary: 80000,
      jobOpenings: 200000,
      topSkills: ['Renewable Energy Systems', 'Sustainability', 'Environmental Science', 'Green Technology']
    },
    careerPaths: [
      {
        title: 'Renewable Energy Engineer',
        description: 'Design and implement renewable energy systems',
        averageSalary: { entry: 55000, mid: 75000, senior: 100000, currency: 'USD' },
        jobTitles: ['Solar Engineer', 'Wind Energy Specialist', 'Sustainability Consultant'],
        companies: ['Tesla', 'First Solar', 'Vestas', 'General Electric', 'Siemens'],
        totalEstimatedHours: 280,
        difficulty: 'Advanced'
      }
    ],
    resources: [
      {
        title: 'Schneider Electric Energy University',
        description: 'Over 200 free vendor-neutral courses on energy efficiency and data center cooling.',
        url: 'https://www.se.com/ww/en/about-us/university/',
        type: 'platform',
        isFree: true,
        rating: 4.6,
        category: 'Energy Efficiency',
        certificate: 'Free'
      },
      {
        title: 'SDG Academy',
        description: 'Professional-level courses on the economics of sustainability and "Clean Power" strategies.',
        url: 'https://sdgacademy.org/',
        type: 'platform',
        isFree: true,
        rating: 4.5,
        category: 'Sustainability Economics',
        certificate: 'Free'
      },
      {
        title: 'Just Have a Think (YouTube)',
        description: 'Clear, evidence-based videos on the latest green technologies entering the private sector.',
        url: 'https://www.youtube.com/@JustHaveAThink',
        type: 'video',
        isFree: true,
        rating: 4.7,
        category: 'Green Technology',
        certificate: 'N/A'
      }
    ]
  }
];

// Aptitude and Interview Preparation Resources
const aptitudeResources = [
  {
    title: 'IndiaBIX',
    description: 'The Industry Standard. Thousands of MCQs with detailed explanations for every topic (Blood Relations, Time & Work, etc.).',
    url: 'https://www.indiabix.com/',
    type: 'platform',
    level: 'Beginner to Pro',
    isFree: true,
    rating: 4.8,
    category: 'Quantitative Aptitude'
  },
  {
    title: 'GeeksforGeeks (Aptitude)',
    description: 'Technical Placements. Specifically tuned for IT companies (TCS, Infosys, Google).',
    url: 'https://www.geeksforgeeks.org/questions/aptitude/',
    type: 'platform',
    level: 'Intermediate',
    isFree: true,
    rating: 4.7,
    category: 'Technical Aptitude'
  },
  {
    title: 'Assessment Day',
    description: 'Psychometric Tests. Free practice for inductive, deductive, and situational judgment tests.',
    url: 'https://www.assessmentday.co.uk/',
    type: 'platform',
    level: 'Intermediate',
    isFree: true,
    rating: 4.5,
    category: 'Psychometric Tests'
  },
  {
    title: 'CareerRide (YouTube)',
    description: 'Topic-wise Tutorials. Excellent step-by-step videos explaining "Shortcuts" and "Tricks."',
    url: 'https://www.youtube.com/@CareerRide',
    type: 'video',
    level: 'Beginner',
    isFree: true,
    rating: 4.6,
    category: 'Aptitude Tutorials'
  }
];

// Interview Preparation Resources
const interviewResources = [
  {
    title: 'Google Interview Warmup',
    description: 'An AI-powered tool that lets you practice answering questions. It transcribes your speech and gives you insights on how to improve your vocabulary and structure.',
    url: 'https://grow.google/grow-your-career/articles/interview-tips/',
    type: 'tool',
    level: 'All Levels',
    isFree: true,
    rating: 4.8,
    category: 'AI Interview Practice'
  },
  {
    title: 'Pramp',
    description: '100% free peer-to-peer mock interviews. You get paired with someone else, you interview them, and they interview you. Great for overcoming "stage fright."',
    url: 'https://www.pramp.com/#/',
    type: 'platform',
    level: 'All Levels',
    isFree: true,
    rating: 4.7,
    category: 'Mock Interviews'
  },
  {
    title: 'Great Learning (Interview Prep)',
    description: 'Free courses on "Interview Etiquettes," "HR Interview Questions," and "STAR Method" for storytelling.',
    url: 'https://www.pramp.com/#/',
    type: 'course',
    level: 'Beginner',
    isFree: true,
    rating: 4.4,
    category: 'Interview Skills'
  },
  {
    title: 'Big Interview (YouTube)',
    description: 'The best channel for learning exactly what a recruiter is looking for when they say "Tell me about yourself."',
    url: 'https://www.youtube.com/@BigInterview',
    type: 'video',
    level: 'All Levels',
    isFree: true,
    rating: 4.6,
    category: 'Interview Techniques'
  }
];

// Demo users with comprehensive profiles
const demoUsers = [
  {
    name: 'Demo User',
    email: 'demo@careerpath.com',
    password: 'demo123',
    selectedDomain: 'IT',
    profile: {
      age: 25,
      location: 'San Francisco, CA',
      education: {
        level: 'Bachelor',
        field: 'Computer Science',
        institution: 'University of California',
        graduationYear: 2020
      },
      experience: {
        level: '1-2 years',
        currentRole: 'Junior Developer',
        company: 'Tech Startup',
        industry: 'Technology'
      },
      interests: ['Web Development', 'Machine Learning', 'Mobile Apps'],
      strengths: ['Problem Solving', 'Quick Learning', 'Team Collaboration']
    },
    progress: {
      currentLevel: 2,
      totalExperience: 1250,
      completionPercentage: 25,
      learningStreak: {
        currentStreak: 5,
        longestStreak: 12,
        totalActiveDays: 45
      },
      totalLearningHours: 120
    },
    gamification: {
      totalPoints: 1250,
      level: 2,
      achievements: [
        {
          title: 'First Steps',
          description: 'Completed your first course',
          category: 'course',
          points: 100,
          earnedAt: new Date('2024-01-15')
        },
        {
          title: 'Week Warrior',
          description: 'Maintained a 7-day learning streak',
          category: 'streak',
          points: 150,
          earnedAt: new Date('2024-01-22')
        }
      ]
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpath', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Domain.deleteMany({})
    ]);
    console.log('🧹 Cleared existing data');

    // Insert domain data
    const insertedDomains = await Domain.insertMany(domainData);
    console.log(`✅ Inserted ${insertedDomains.length} domains`);

    // Insert demo users
    const insertedUsers = await User.insertMany(demoUsers);
    console.log(`✅ Inserted ${insertedUsers.length} demo users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   • ${insertedDomains.length} Career Domains`);
    console.log(`   • ${insertedUsers.length} Demo Users`);
    console.log(`   • ${domainData.reduce((acc, domain) => acc + domain.careerPaths.length, 0)} Career Paths`);
    console.log(`   • ${domainData.reduce((acc, domain) => acc + domain.resources.length, 0)} Learning Resources`);
    console.log(`   • ${aptitudeResources.length} Aptitude Resources`);
    console.log(`   • ${interviewResources.length} Interview Resources`);
    
    console.log('\n👤 Demo Accounts:');
    demoUsers.forEach(user => {
      console.log(`   • ${user.email} / ${user.password} (${user.selectedDomain})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { 
  seedDatabase, 
  domainData, 
  demoUsers, 
  aptitudeResources, 
  interviewResources 
};