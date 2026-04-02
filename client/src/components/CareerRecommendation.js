import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CareerRecommendation = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    education: '',
    experience: '',
    skills: [],
    interests: [],
    workStyle: '',
    careerGoal: ''
  });
  const [recommendations, setRecommendations] = useState(null);

  const skillOptions = [
    'Programming', 'Data Analysis', 'Communication', 'Leadership',
    'Problem Solving', 'Creativity', 'Technical Writing', 'Design',
    'Mathematics', 'Research', 'Teaching', 'Sales', 'Marketing',
    'Project Management', 'Critical Thinking', 'Teamwork'
  ];

  const interestOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Arts',
    'Science', 'Business', 'Social Work', 'Engineering', 'Media',
    'Sports', 'Environment', 'Law', 'Psychology', 'Data'
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayItem = (field, item) => {
    const current = formData[field];
    if (current.includes(item)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

  // Career Recommendation Algorithm
  const generateRecommendations = () => {
    const careerDatabase = [
      {
        title: 'Full-Stack Developer',
        domain: 'IT',
        matchScore: 0,
        requiredSkills: ['Programming', 'Problem Solving', 'Technical Writing'],
        requiredInterests: ['Technology', 'Engineering'],
        ageRange: [18, 50],
        educationLevel: ['Bachelor', 'Master', 'Self-taught'],
        experienceLevel: ['Entry', 'Mid', 'Senior'],
        workStyle: ['Remote', 'Hybrid', 'Office'],
        salary: '$70k - $150k',
        growth: 'Very High',
        description: 'Build web applications using modern technologies like React, Node.js, and cloud platforms.',
        roadmap: ['Learn HTML/CSS/JavaScript', 'Master React', 'Learn Backend (Node.js)', 'Database Skills', 'Deploy Projects']
      },
      {
        title: 'Data Scientist',
        domain: 'DataScience',
        matchScore: 0,
        requiredSkills: ['Data Analysis', 'Mathematics', 'Programming', 'Critical Thinking'],
        requiredInterests: ['Technology', 'Data', 'Science'],
        ageRange: [22, 55],
        educationLevel: ['Bachelor', 'Master', 'PhD'],
        experienceLevel: ['Entry', 'Mid', 'Senior'],
        workStyle: ['Remote', 'Hybrid', 'Office'],
        salary: '$90k - $180k',
        growth: 'Very High',
        description: 'Analyze data, build ML models, and extract insights to drive business decisions.',
        roadmap: ['Learn Python/R', 'Statistics & Probability', 'Machine Learning', 'Data Visualization', 'Real Projects']
      },
      {
        title: 'Healthcare Administrator',
        domain: 'Healthcare',
        matchScore: 0,
        requiredSkills: ['Leadership', 'Communication', 'Project Management'],
        requiredInterests: ['Healthcare', 'Business', 'Social Work'],
        ageRange: [25, 60],
        educationLevel: ['Bachelor', 'Master'],
        experienceLevel: ['Mid', 'Senior'],
        workStyle: ['Office', 'Hybrid'],
        salary: '$70k - $130k',
        growth: 'High',
        description: 'Manage healthcare facilities, coordinate staff, and ensure quality patient care.',
        roadmap: ['Healthcare Basics', 'Management Skills', 'Healthcare Laws', 'Leadership Training', 'Certification']
      },
      {
        title: 'Financial Analyst',
        domain: 'Finance',
        matchScore: 0,
        requiredSkills: ['Data Analysis', 'Mathematics', 'Critical Thinking', 'Communication'],
        requiredInterests: ['Finance', 'Business', 'Data'],
        ageRange: [22, 55],
        educationLevel: ['Bachelor', 'Master'],
        experienceLevel: ['Entry', 'Mid', 'Senior'],
        workStyle: ['Office', 'Hybrid'],
        salary: '$65k - $120k',
        growth: 'High',
        description: 'Analyze financial data, create reports, and provide investment recommendations.',
        roadmap: ['Finance Fundamentals', 'Excel Mastery', 'Financial Modeling', 'CFA Certification', 'Industry Experience']
      },
      {
        title: 'UX/UI Designer',
        domain: 'IT',
        matchScore: 0,
        requiredSkills: ['Creativity', 'Design', 'Communication', 'Problem Solving'],
        requiredInterests: ['Technology', 'Arts', 'Psychology'],
        ageRange: [20, 50],
        educationLevel: ['Bachelor', 'Self-taught', 'Bootcamp'],
        experienceLevel: ['Entry', 'Mid', 'Senior'],
        workStyle: ['Remote', 'Hybrid', 'Office'],
        salary: '$60k - $130k',
        growth: 'High',
        description: 'Design user interfaces and experiences for digital products.',
        roadmap: ['Design Principles', 'Figma/Adobe XD', 'User Research', 'Prototyping', 'Portfolio Building']
      },
      {
        title: 'Business Analyst',
        domain: 'Finance',
        matchScore: 0,
        requiredSkills: ['Data Analysis', 'Communication', 'Problem Solving', 'Critical Thinking'],
        requiredInterests: ['Business', 'Technology', 'Data'],
        ageRange: [22, 55],
        educationLevel: ['Bachelor', 'Master'],
        experienceLevel: ['Entry', 'Mid', 'Senior'],
        workStyle: ['Office', 'Hybrid', 'Remote'],
        salary: '$65k - $110k',
        growth: 'High',
        description: 'Bridge gap between business needs and technical solutions.',
        roadmap: ['Business Fundamentals', 'Data Analysis', 'SQL', 'Requirements Gathering', 'Agile Methodology']
      },
      {
        title: 'Content Creator',
        domain: 'Interview',
        matchScore: 0,
        requiredSkills: ['Creativity', 'Communication', 'Marketing', 'Technical Writing'],
        requiredInterests: ['Media', 'Arts', 'Technology'],
        ageRange: [18, 50],
        educationLevel: ['Bachelor', 'Self-taught'],
        experienceLevel: ['Entry', 'Mid', 'Senior'],
        workStyle: ['Remote', 'Hybrid'],
        salary: '$40k - $100k',
        growth: 'Very High',
        description: 'Create engaging content for digital platforms and social media.',
        roadmap: ['Content Strategy', 'Video/Photo Editing', 'SEO Basics', 'Social Media', 'Build Audience']
      },
      {
        title: 'Project Manager',
        domain: 'Aptitude',
        matchScore: 0,
        requiredSkills: ['Leadership', 'Communication', 'Project Management', 'Problem Solving'],
        requiredInterests: ['Business', 'Technology'],
        ageRange: [25, 60],
        educationLevel: ['Bachelor', 'Master'],
        experienceLevel: ['Mid', 'Senior'],
        workStyle: ['Office', 'Hybrid', 'Remote'],
        salary: '$75k - $140k',
        growth: 'High',
        description: 'Lead projects, manage teams, and ensure successful delivery.',
        roadmap: ['PM Fundamentals', 'Agile/Scrum', 'PMP Certification', 'Leadership Skills', 'Tool Mastery']
      }
    ];

    // Decision-Making Algorithm
    const scoredCareers = careerDatabase.map(career => {
      let score = 0;
      
      // Age matching (20 points)
      const age = parseInt(formData.age);
      if (age >= career.ageRange[0] && age <= career.ageRange[1]) {
        score += 20;
      }
      
      // Education matching (15 points)
      if (career.educationLevel.includes(formData.education)) {
        score += 15;
      }
      
      // Experience matching (15 points)
      if (career.experienceLevel.includes(formData.experience)) {
        score += 15;
      }
      
      // Skills matching (25 points)
      const matchingSkills = career.requiredSkills.filter(skill => 
        formData.skills.includes(skill)
      );
      score += (matchingSkills.length / career.requiredSkills.length) * 25;
      
      // Interests matching (20 points)
      const matchingInterests = career.requiredInterests.filter(interest => 
        formData.interests.includes(interest)
      );
      score += (matchingInterests.length / career.requiredInterests.length) * 20;
      
      // Work style matching (5 points)
      if (career.workStyle.includes(formData.workStyle)) {
        score += 5;
      }
      
      return { ...career, matchScore: Math.round(score) };
    });

    // Sort by match score and get top 5
    const topRecommendations = scoredCareers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    setRecommendations(topRecommendations);
    setStep(4);
  };

  const handleSubmit = () => {
    if (step === 3) {
      generateRecommendations();
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.age && formData.education && formData.experience;
    }
    if (step === 2) {
      return formData.skills.length > 0 && formData.interests.length > 0;
    }
    if (step === 3) {
      return formData.workStyle && formData.careerGoal;
    }
    return false;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
      animation: 'gradientShift 15s ease infinite',
      backgroundSize: '200% 200%',
      padding: '2rem'
    },
    content: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    backBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      transition: 'all 0.3s ease'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '3rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
    },
    title: {
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      textAlign: 'center',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.95)',
      fontSize: '1.1rem',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    progressBar: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '3rem',
      position: 'relative'
    },
    progressStep: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      zIndex: 2,
      transition: 'all 0.3s ease'
    },
    progressLine: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      right: '15px',
      height: '3px',
      background: 'rgba(255, 255, 255, 0.2)',
      zIndex: 1
    },
    formGroup: {
      marginBottom: '2rem'
    },
    label: {
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '700',
      marginBottom: '0.75rem',
      display: 'block',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    input: {
      width: '100%',
      padding: '1rem',
      borderRadius: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    },
    select: {
      width: '100%',
      padding: '1rem',
      borderRadius: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: 'pointer'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    optionChip: {
      padding: '0.75rem 1rem',
      borderRadius: '50px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      fontWeight: '600'
    },
    optionChipSelected: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    button: {
      flex: 1,
      padding: '1rem 2rem',
      borderRadius: '50px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(20, 184, 166, 0.4)'
    },
    secondaryBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    recommendationCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginBottom: '1.5rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease'
    },
    matchScore: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      fontWeight: '700',
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    careerTitle: {
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '0.5rem'
    },
    careerInfo: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    roadmapList: {
      listStyle: 'none',
      padding: 0,
      marginTop: '1rem'
    },
    roadmapItem: {
      color: 'rgba(255, 255, 255, 0.9)',
      padding: '0.5rem 0',
      fontSize: '0.95rem'
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 style={styles.title}>📋 Basic Information</h2>
      <p style={styles.subtitle}>Tell us about yourself</p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Your Age</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleChange('age', e.target.value)}
          placeholder="Enter your age"
          style={styles.input}
          min="15"
          max="70"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Education Level</label>
        <select
          value={formData.education}
          onChange={(e) => handleChange('education', e.target.value)}
          style={styles.select}
        >
          <option value="">Select education level</option>
          <option value="High School">High School</option>
          <option value="Bachelor">Bachelor's Degree</option>
          <option value="Master">Master's Degree</option>
          <option value="PhD">PhD</option>
          <option value="Bootcamp">Bootcamp/Certificate</option>
          <option value="Self-taught">Self-taught</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Experience Level</label>
        <select
          value={formData.experience}
          onChange={(e) => handleChange('experience', e.target.value)}
          style={styles.select}
        >
          <option value="">Select experience level</option>
          <option value="Entry">Entry Level (0-2 years)</option>
          <option value="Mid">Mid Level (3-5 years)</option>
          <option value="Senior">Senior Level (6+ years)</option>
        </select>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 style={styles.title}>🎯 Skills & Interests</h2>
      <p style={styles.subtitle}>Select your top skills and interests</p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Your Skills (Select 3-5)</label>
        <div style={styles.optionsGrid}>
          {skillOptions.map(skill => (
            <div
              key={skill}
              onClick={() => toggleArrayItem('skills', skill)}
              style={{
                ...styles.optionChip,
                ...(formData.skills.includes(skill) ? styles.optionChipSelected : {})
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Your Interests (Select 2-4)</label>
        <div style={styles.optionsGrid}>
          {interestOptions.map(interest => (
            <div
              key={interest}
              onClick={() => toggleArrayItem('interests', interest)}
              style={{
                ...styles.optionChip,
                ...(formData.interests.includes(interest) ? styles.optionChipSelected : {})
              }}
            >
              {interest}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 style={styles.title}>💼 Work Preferences</h2>
      <p style={styles.subtitle}>Tell us about your ideal work environment</p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Work Style</label>
        <select
          value={formData.workStyle}
          onChange={(e) => handleChange('workStyle', e.target.value)}
          style={styles.select}
        >
          <option value="">Select work style</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Office">Office</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Career Goal</label>
        <select
          value={formData.careerGoal}
          onChange={(e) => handleChange('careerGoal', e.target.value)}
          style={styles.select}
        >
          <option value="">Select your goal</option>
          <option value="High Salary">High Salary</option>
          <option value="Work-Life Balance">Work-Life Balance</option>
          <option value="Career Growth">Career Growth</option>
          <option value="Job Security">Job Security</option>
          <option value="Make Impact">Make an Impact</option>
        </select>
      </div>
    </motion.div>
  );

  const renderRecommendations = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h2 style={styles.title}>🎉 Your Career Recommendations</h2>
      <p style={styles.subtitle}>Based on your profile, here are the best career matches</p>

      {recommendations && recommendations.map((career, index) => (
        <motion.div
          key={career.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={styles.recommendationCard}
          whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)' }}
        >
          <div style={{
            ...styles.matchScore,
            background: career.matchScore >= 80 ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
                       career.matchScore >= 60 ? 'linear-gradient(135deg, #14b8a6, #0d9488)' :
                       'linear-gradient(135deg, #06b6d4, #0891b2)',
            color: 'white'
          }}>
            {career.matchScore}% Match
          </div>

          <h3 style={styles.careerTitle}>
            {index === 0 && '🏆 '}
            {career.title}
          </h3>

          <div style={styles.careerInfo}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>💰 Salary:</strong> {career.salary}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>📈 Growth:</strong> {career.growth}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>📝 Description:</strong> {career.description}
            </div>
          </div>

          <div>
            <strong style={{ color: 'white', fontSize: '1.1rem' }}>🗺️ Learning Roadmap:</strong>
            <ul style={styles.roadmapList}>
              {career.roadmap.map((step, i) => (
                <li key={i} style={styles.roadmapItem}>
                  {i + 1}. {step}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}

      <motion.button
        onClick={() => {
          setStep(1);
          setRecommendations(null);
          setFormData({
            age: '',
            education: '',
            experience: '',
            skills: [],
            interests: [],
            workStyle: '',
            careerGoal: ''
          });
        }}
        style={{ ...styles.button, ...styles.primaryBtn, width: '100%' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        🔄 Start Over
      </motion.button>
    </motion.div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {onBack && (
          <motion.button
            onClick={onBack}
            style={styles.backBtn}
            whileHover={{ 
              scale: 1.05,
              background: 'rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
        )}

        <div style={styles.card}>
          {step < 4 && (
            <div style={styles.progressBar}>
              <div style={styles.progressLine}></div>
              {[1, 2, 3].map(num => (
                <div
                  key={num}
                  style={{
                    ...styles.progressStep,
                    background: num <= step 
                      ? 'linear-gradient(135deg, #14b8a6, #22c55e)' 
                      : 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderRecommendations()}
          </AnimatePresence>

          {step < 4 && (
            <div style={styles.buttonGroup}>
              {step > 1 && (
                <motion.button
                  onClick={() => setStep(step - 1)}
                  style={{ ...styles.button, ...styles.secondaryBtn }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Previous
                </motion.button>
              )}
              <motion.button
                onClick={handleSubmit}
                disabled={!canProceed()}
                style={{
                  ...styles.button,
                  ...styles.primaryBtn,
                  opacity: canProceed() ? 1 : 0.5,
                  cursor: canProceed() ? 'pointer' : 'not-allowed'
                }}
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
              >
                {step === 3 ? '🎯 Get Recommendations' : 'Next →'}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendation;
