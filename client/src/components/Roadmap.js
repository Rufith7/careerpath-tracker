import React from 'react';
import { motion } from 'framer-motion';

const Roadmap = ({ domain, userProgress, onBack, onLevelClick }) => {
  const roadmaps = {
    IT: {
      title: 'Full-Stack Web Developer',
      icon: '💻',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      levels: [
        {
          level: 1,
          title: 'HTML & CSS Fundamentals',
          description: 'Master the building blocks of web development',
          topics: ['HTML5 Semantic Tags', 'CSS Flexbox & Grid', 'Responsive Design', 'CSS Animations'],
          duration: '2-3 weeks',
          skills: ['HTML', 'CSS', 'Web Design']
        },
        {
          level: 2,
          title: 'JavaScript Essentials',
          description: 'Learn modern JavaScript and ES6+ features',
          topics: ['Variables & Data Types', 'Functions & Scope', 'DOM Manipulation', 'Async/Await'],
          duration: '3-4 weeks',
          skills: ['JavaScript', 'ES6+', 'DOM']
        },
        {
          level: 3,
          title: 'React Development',
          description: 'Build modern user interfaces with React',
          topics: ['Components & Props', 'State & Hooks', 'React Router', 'Context API'],
          duration: '4-5 weeks',
          skills: ['React', 'JSX', 'Hooks']
        },
        {
          level: 4,
          title: 'Backend with Node.js',
          description: 'Create server-side applications',
          topics: ['Express.js', 'REST APIs', 'MongoDB', 'Authentication'],
          duration: '4-5 weeks',
          skills: ['Node.js', 'Express', 'MongoDB']
        },
        {
          level: 5,
          title: 'Full-Stack & Deployment',
          description: 'Deploy production-ready applications',
          topics: ['Docker', 'AWS/Heroku', 'CI/CD', 'Testing'],
          duration: '3-4 weeks',
          skills: ['Docker', 'AWS', 'DevOps']
        }
      ]
    },
    DataScience: {
      title: 'Data Scientist',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      levels: [
        {
          level: 1,
          title: 'Python & Statistics Basics',
          description: 'Foundation of data science',
          topics: ['Python Basics', 'NumPy & Pandas', 'Descriptive Statistics', 'Data Visualization'],
          duration: '3-4 weeks',
          skills: ['Python', 'Statistics', 'Pandas']
        },
        {
          level: 2,
          title: 'Data Analysis & SQL',
          description: 'Analyze and query data effectively',
          topics: ['SQL Queries', 'Data Cleaning', 'Exploratory Analysis', 'Matplotlib/Seaborn'],
          duration: '3-4 weeks',
          skills: ['SQL', 'Data Analysis', 'Visualization']
        },
        {
          level: 3,
          title: 'Machine Learning Fundamentals',
          description: 'Build predictive models',
          topics: ['Supervised Learning', 'Regression', 'Classification', 'Model Evaluation'],
          duration: '4-5 weeks',
          skills: ['ML', 'Scikit-learn', 'Algorithms']
        },
        {
          level: 4,
          title: 'Advanced ML & Deep Learning',
          description: 'Neural networks and deep learning',
          topics: ['Neural Networks', 'TensorFlow/PyTorch', 'CNNs', 'NLP Basics'],
          duration: '5-6 weeks',
          skills: ['Deep Learning', 'TensorFlow', 'PyTorch']
        },
        {
          level: 5,
          title: 'Production ML & Big Data',
          description: 'Deploy ML models at scale',
          topics: ['MLOps', 'Model Deployment', 'Spark', 'Cloud ML'],
          duration: '4-5 weeks',
          skills: ['MLOps', 'Spark', 'Cloud']
        }
      ]
    },
    Healthcare: {
      title: 'Healthcare Professional',
      icon: '🏥',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      levels: [
        {
          level: 1,
          title: 'Medical Terminology & Anatomy',
          description: 'Foundation of healthcare knowledge',
          topics: ['Medical Terms', 'Human Anatomy', 'Body Systems', 'Basic Physiology'],
          duration: '4-5 weeks',
          skills: ['Anatomy', 'Terminology', 'Physiology']
        },
        {
          level: 2,
          title: 'Patient Care Basics',
          description: 'Essential patient care skills',
          topics: ['Vital Signs', 'Patient Assessment', 'Communication', 'Medical Ethics'],
          duration: '4-5 weeks',
          skills: ['Patient Care', 'Communication', 'Ethics']
        },
        {
          level: 3,
          title: 'Clinical Procedures',
          description: 'Hands-on clinical skills',
          topics: ['Medical Procedures', 'Diagnostic Tests', 'Treatment Plans', 'Documentation'],
          duration: '5-6 weeks',
          skills: ['Clinical Skills', 'Diagnostics', 'Documentation']
        },
        {
          level: 4,
          title: 'Specialized Care',
          description: 'Advanced medical specializations',
          topics: ['Emergency Care', 'Pharmacology', 'Disease Management', 'Surgical Basics'],
          duration: '6-8 weeks',
          skills: ['Emergency Care', 'Pharmacology', 'Specialization']
        },
        {
          level: 5,
          title: 'Healthcare Management',
          description: 'Leadership and administration',
          topics: ['Healthcare Systems', 'Quality Improvement', 'Leadership', 'Research'],
          duration: '4-5 weeks',
          skills: ['Management', 'Leadership', 'Research']
        }
      ]
    },
    Finance: {
      title: 'Financial Analyst',
      icon: '💰',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      levels: [
        {
          level: 1,
          title: 'Finance Fundamentals',
          description: 'Core financial concepts',
          topics: ['Accounting Basics', 'Financial Statements', 'Time Value of Money', 'Excel Basics'],
          duration: '3-4 weeks',
          skills: ['Accounting', 'Excel', 'Finance Basics']
        },
        {
          level: 2,
          title: 'Financial Analysis',
          description: 'Analyze financial data',
          topics: ['Ratio Analysis', 'Financial Modeling', 'Valuation', 'Excel Advanced'],
          duration: '4-5 weeks',
          skills: ['Analysis', 'Modeling', 'Valuation']
        },
        {
          level: 3,
          title: 'Investment & Markets',
          description: 'Understand capital markets',
          topics: ['Stocks & Bonds', 'Portfolio Theory', 'Risk Management', 'Bloomberg Terminal'],
          duration: '4-5 weeks',
          skills: ['Investments', 'Markets', 'Risk']
        },
        {
          level: 4,
          title: 'Corporate Finance',
          description: 'Advanced corporate finance',
          topics: ['M&A', 'Capital Structure', 'Corporate Valuation', 'Financial Strategy'],
          duration: '5-6 weeks',
          skills: ['M&A', 'Strategy', 'Valuation']
        },
        {
          level: 5,
          title: 'Professional Certification',
          description: 'CFA/CPA preparation',
          topics: ['CFA Level I', 'Ethics', 'Advanced Topics', 'Case Studies'],
          duration: '8-12 weeks',
          skills: ['CFA', 'Professional', 'Advanced']
        }
      ]
    },
    Aptitude: {
      title: 'Aptitude Master',
      icon: '🧠',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      levels: [
        {
          level: 1,
          title: 'Quantitative Basics',
          description: 'Foundation of numerical ability',
          topics: ['Arithmetic', 'Percentages', 'Ratios', 'Basic Algebra'],
          duration: '2-3 weeks',
          skills: ['Math', 'Calculations', 'Speed']
        },
        {
          level: 2,
          title: 'Logical Reasoning',
          description: 'Develop logical thinking',
          topics: ['Patterns', 'Sequences', 'Analogies', 'Coding-Decoding'],
          duration: '3-4 weeks',
          skills: ['Logic', 'Patterns', 'Reasoning']
        },
        {
          level: 3,
          title: 'Data Interpretation',
          description: 'Analyze charts and graphs',
          topics: ['Tables', 'Graphs', 'Charts', 'Data Analysis'],
          duration: '3-4 weeks',
          skills: ['Data', 'Analysis', 'Interpretation']
        },
        {
          level: 4,
          title: 'Verbal Ability',
          description: 'Master language skills',
          topics: ['Vocabulary', 'Grammar', 'Reading Comprehension', 'Sentence Correction'],
          duration: '3-4 weeks',
          skills: ['Verbal', 'Language', 'Communication']
        },
        {
          level: 5,
          title: 'Advanced Problem Solving',
          description: 'Complex aptitude challenges',
          topics: ['Advanced Math', 'Puzzles', 'Time Management', 'Mock Tests'],
          duration: '4-5 weeks',
          skills: ['Advanced', 'Speed', 'Accuracy']
        }
      ]
    },
    Interview: {
      title: 'Interview Expert',
      icon: '🎤',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      levels: [
        {
          level: 1,
          title: 'Interview Basics',
          description: 'Foundation of interview skills',
          topics: ['Resume Building', 'Cover Letters', 'Research', 'First Impressions'],
          duration: '1-2 weeks',
          skills: ['Resume', 'Preparation', 'Basics']
        },
        {
          level: 2,
          title: 'Behavioral Questions',
          description: 'Master STAR method',
          topics: ['STAR Method', 'Common Questions', 'Story Telling', 'Examples'],
          duration: '2-3 weeks',
          skills: ['Behavioral', 'STAR', 'Stories']
        },
        {
          level: 3,
          title: 'Technical Interviews',
          description: 'Technical question strategies',
          topics: ['Problem Solving', 'Coding Questions', 'System Design', 'Technical Communication'],
          duration: '3-4 weeks',
          skills: ['Technical', 'Coding', 'Problem Solving']
        },
        {
          level: 4,
          title: 'Communication & Body Language',
          description: 'Non-verbal communication',
          topics: ['Body Language', 'Voice Modulation', 'Confidence', 'Active Listening'],
          duration: '2-3 weeks',
          skills: ['Communication', 'Confidence', 'Presence']
        },
        {
          level: 5,
          title: 'Advanced Interview Mastery',
          description: 'Negotiation and follow-up',
          topics: ['Salary Negotiation', 'Follow-up', 'Multiple Offers', 'Mock Interviews'],
          duration: '2-3 weeks',
          skills: ['Negotiation', 'Strategy', 'Mastery']
        }
      ]
    }
  };

  const roadmap = roadmaps[domain] || roadmaps.IT;
  const progress = userProgress?.[domain] || { currentLevel: 1, unlockedLevels: [1] };
  const unlockedLevels = progress.unlockedLevels || [1];

  const isLevelUnlocked = (level) => unlockedLevels.includes(level);

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    roadmapTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: 'white',
      marginBottom: '0.5rem',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    },
    roadmapSubtitle: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500'
    },
    timeline: {
      position: 'relative',
      paddingLeft: '3rem'
    },
    timelineLine: {
      position: 'absolute',
      left: '2rem',
      top: '2rem',
      bottom: '2rem',
      width: '4px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
      borderRadius: '2px'
    },
    levelCard: {
      position: 'relative',
      marginBottom: '2rem',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease'
    },
    levelCardLocked: {
      opacity: 0.6,
      filter: 'grayscale(50%)',
      cursor: 'not-allowed'
    },
    levelCardUnlocked: {
      cursor: 'pointer'
    },
    levelBadge: {
      position: 'absolute',
      left: '-3rem',
      top: '2rem',
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '700',
      boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      zIndex: 2
    },
    levelBadgeLocked: {
      background: 'rgba(156, 163, 175, 0.5)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    levelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    levelTitle: {
      fontSize: '1.6rem',
      fontWeight: '700',
      color: 'white',
      marginBottom: '0.5rem',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    },
    levelDescription: {
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    topicsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    topic: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '0.6rem 1rem',
      borderRadius: '0.75rem',
      color: 'white',
      fontSize: '0.9rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    skillsList: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '1rem'
    },
    skill: {
      background: 'rgba(59, 130, 246, 0.3)',
      color: '#93c5fd',
      padding: '0.4rem 0.8rem',
      borderRadius: '0.5rem',
      fontSize: '0.85rem',
      fontWeight: '600',
      border: '1px solid rgba(59, 130, 246, 0.5)'
    },
    duration: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(249, 115, 22, 0.3)',
      color: '#fdba74',
      padding: '0.5rem 1rem',
      borderRadius: '0.75rem',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: '1px solid rgba(249, 115, 22, 0.5)'
    },
    lockIcon: {
      fontSize: '2rem',
      position: 'absolute',
      right: '2rem',
      top: '2rem',
      opacity: 0.5
    },
    startButton: {
      background: 'linear-gradient(135deg, #3b82f6, #22c55e)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      {onBack && (
        <motion.button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          whileHover={{ 
            scale: 1.05,
            background: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>←</span>
          <span>Back to Domains</span>
        </motion.button>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={styles.roadmapTitle}>
          <span>{roadmap.icon}</span>
          <span>{roadmap.title} Roadmap</span>
        </h1>
        <p style={styles.roadmapSubtitle}>
          Complete all 5 levels to master your career path
        </p>
      </motion.div>

      <div style={styles.timeline}>
        <div style={styles.timelineLine}></div>
        
        {roadmap.levels.map((levelData, index) => {
          const unlocked = isLevelUnlocked(levelData.level);
          
          return (
            <motion.div
              key={levelData.level}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                ...styles.levelCard,
                ...(unlocked ? styles.levelCardUnlocked : styles.levelCardLocked)
              }}
              onClick={() => unlocked && onLevelClick && onLevelClick(levelData.level)}
              whileHover={unlocked ? { 
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              } : {}}
            >
              <motion.div
                style={{
                  ...styles.levelBadge,
                  ...(unlocked ? {} : styles.levelBadgeLocked)
                }}
                animate={unlocked ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 4px 15px rgba(67, 233, 123, 0.4)',
                    '0 6px 25px rgba(67, 233, 123, 0.6)',
                    '0 4px 15px rgba(67, 233, 123, 0.4)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {unlocked ? levelData.level : '🔒'}
              </motion.div>

              {!unlocked && (
                <div style={styles.lockIcon}>🔒</div>
              )}

              <div style={styles.levelHeader}>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.levelTitle}>
                    Level {levelData.level}: {levelData.title}
                  </h3>
                  <p style={styles.levelDescription}>
                    {levelData.description}
                  </p>
                </div>
                <div style={styles.duration}>
                  <span>⏱️</span>
                  <span>{levelData.duration}</span>
                </div>
              </div>

              <div style={styles.topicsList}>
                {levelData.topics.map((topic, i) => (
                  <motion.div
                    key={i}
                    style={styles.topic}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    <span>✓</span>
                    <span>{topic}</span>
                  </motion.div>
                ))}
              </div>

              <div style={styles.skillsList}>
                {levelData.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    style={styles.skill}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              {unlocked && (
                <motion.button
                  style={styles.startButton}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLevelClick && onLevelClick(levelData.level);
                  }}
                >
                  {progress.currentLevel === levelData.level ? 'Continue Learning' : 'Start Level'} →
                </motion.button>
              )}

              {!unlocked && (
                <div style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.95rem',
                  marginTop: '1rem',
                  fontStyle: 'italic'
                }}>
                  🔒 Complete Level {levelData.level - 1} to unlock
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
