import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeBuilder = ({ selectedDomain, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  const domainTemplates = {
    IT: {
      name: 'John Developer',
      email: 'john.dev@email.com',
      phone: '+1 (555) 123-4567',
      summary: 'Passionate Full-Stack Developer with 3+ years of experience in building scalable web applications using React, Node.js, and cloud technologies. Strong problem-solving skills and commitment to writing clean, maintainable code.',
      experience: `Senior Full-Stack Developer | Tech Solutions Inc. | 2022-Present
• Developed and maintained 15+ enterprise web applications using React and Node.js
• Improved application performance by 40% through code optimization and caching strategies
• Led a team of 5 developers in agile development environment
• Implemented CI/CD pipelines reducing deployment time by 60%

Junior Developer | StartUp Co. | 2020-2022
• Built responsive web interfaces using React, TypeScript, and Material-UI
• Collaborated with cross-functional teams to deliver projects on time
• Wrote unit tests achieving 85% code coverage`,
      education: `Bachelor of Science in Computer Science
University of Technology | 2016-2020
GPA: 3.8/4.0

Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems`,
      skills: 'JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, Git, REST APIs, GraphQL, Agile/Scrum, CI/CD, Jest, Redux, Next.js, Tailwind CSS',
      projects: `E-Commerce Platform (React, Node.js, MongoDB)
• Built full-stack e-commerce application with payment integration
• Implemented real-time inventory management system
• Achieved 10,000+ monthly active users

Task Management App (React, Firebase)
• Developed collaborative task management tool with real-time updates
• Integrated authentication and cloud storage
• Published on App Store with 4.5★ rating`,
      certifications: `AWS Certified Solutions Architect - Associate (2023)
MongoDB Certified Developer (2022)
React Advanced Certification - Meta (2023)`
    },
    DataScience: {
      name: 'Sarah Data Scientist',
      email: 'sarah.data@email.com',
      phone: '+1 (555) 234-5678',
      summary: 'Data Scientist with 4+ years of experience in machine learning, statistical analysis, and data visualization. Expertise in Python, R, and SQL with a proven track record of delivering actionable insights that drive business decisions.',
      experience: `Senior Data Scientist | Analytics Corp | 2021-Present
• Developed ML models improving customer retention by 25%
• Built predictive analytics dashboards using Python and Tableau
• Led data science team of 4 members on multiple projects
• Implemented A/B testing framework increasing conversion by 18%

Data Analyst | Research Institute | 2019-2021
• Analyzed large datasets using Python, R, and SQL
• Created data visualizations and reports for stakeholders
• Automated data pipelines reducing processing time by 50%`,
      education: `Master of Science in Data Science
Data Science University | 2017-2019

Bachelor of Science in Statistics
State University | 2013-2017`,
      skills: 'Python, R, SQL, Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, Tableau, Power BI, Jupyter, Git, AWS, Azure, Statistical Analysis, A/B Testing, NLP, Computer Vision',
      projects: `Customer Churn Prediction Model
• Built ML model with 92% accuracy using Random Forest and XGBoost
• Deployed model to production serving 1M+ predictions daily

Sentiment Analysis System
• Developed NLP pipeline for social media sentiment analysis
• Processed 100K+ tweets daily with 88% accuracy`,
      certifications: `Google Data Analytics Professional Certificate (2023)
AWS Certified Machine Learning - Specialty (2022)
TensorFlow Developer Certificate (2023)`
    },
    Healthcare: {
      name: 'Dr. Emily Healthcare',
      email: 'emily.health@email.com',
      phone: '+1 (555) 345-6789',
      summary: 'Dedicated Healthcare Professional with 5+ years of experience in patient care, medical research, and healthcare management. Strong clinical skills combined with excellent communication and leadership abilities.',
      experience: `Senior Medical Officer | City Hospital | 2020-Present
• Provided comprehensive medical care to 50+ patients daily
• Led quality improvement initiatives improving patient satisfaction by 30%
• Mentored junior medical staff and interns
• Implemented electronic health records system

Medical Resident | General Hospital | 2018-2020
• Completed rotations in internal medicine, surgery, and emergency care
• Participated in medical research projects
• Assisted in 200+ surgical procedures`,
      education: `Doctor of Medicine (MD)
Medical School University | 2014-2018

Bachelor of Science in Biology
Science University | 2010-2014`,
      skills: 'Patient Care, Clinical Diagnosis, Medical Research, Healthcare Management, Electronic Health Records (EHR), Medical Documentation, Emergency Medicine, Patient Communication, Team Leadership, Quality Improvement, HIPAA Compliance',
      projects: `Telemedicine Platform Implementation
• Led implementation of telemedicine system serving 5,000+ patients
• Reduced wait times by 40% and improved access to care

Patient Safety Initiative
• Developed protocols reducing medical errors by 25%
• Trained 50+ staff members on new safety procedures`,
      certifications: `Board Certified in Internal Medicine (2020)
Advanced Cardiac Life Support (ACLS) (2023)
Basic Life Support (BLS) (2023)`
    },
    Finance: {
      name: 'Michael Finance',
      email: 'michael.finance@email.com',
      phone: '+1 (555) 456-7890',
      summary: 'Financial Analyst with 4+ years of experience in financial modeling, investment analysis, and strategic planning. Proven ability to analyze complex financial data and provide actionable recommendations that drive business growth.',
      experience: `Senior Financial Analyst | Investment Bank | 2021-Present
• Conducted financial analysis for M&A deals worth $500M+
• Built complex financial models for valuation and forecasting
• Presented investment recommendations to C-level executives
• Managed portfolio of 20+ clients with $100M+ AUM

Financial Analyst | Corporate Finance | 2019-2021
• Prepared monthly financial reports and variance analysis
• Developed budgets and forecasts for multiple business units
• Identified cost-saving opportunities worth $2M annually`,
      education: `Master of Business Administration (MBA) - Finance
Business School | 2017-2019

Bachelor of Science in Finance
University of Commerce | 2013-2017`,
      skills: 'Financial Modeling, Excel, VBA, Python, SQL, Financial Analysis, Investment Analysis, Valuation, M&A, Due Diligence, Bloomberg Terminal, Capital Markets, Risk Management, Portfolio Management, Financial Reporting, Budgeting, Forecasting',
      projects: `Automated Financial Reporting System
• Developed Python-based system automating monthly reports
• Reduced reporting time by 70% and improved accuracy

Investment Portfolio Optimization
• Created portfolio optimization model using modern portfolio theory
• Achieved 15% higher returns with same risk level`,
      certifications: `Chartered Financial Analyst (CFA) Level II Candidate
Financial Risk Manager (FRM) (2022)
Bloomberg Market Concepts (BMC) (2023)`
    },
    Aptitude: {
      name: 'Alex Problem Solver',
      email: 'alex.solver@email.com',
      phone: '+1 (555) 567-8901',
      summary: 'Analytical professional with exceptional problem-solving skills and strong aptitude in quantitative reasoning, logical thinking, and data interpretation. Proven track record in competitive examinations and analytical roles.',
      experience: `Business Analyst | Consulting Firm | 2021-Present
• Analyzed complex business problems and provided data-driven solutions
• Conducted market research and competitive analysis
• Improved operational efficiency by 35% through process optimization
• Presented findings to stakeholders using data visualization

Research Analyst | Think Tank | 2019-2021
• Conducted quantitative and qualitative research studies
• Analyzed statistical data and prepared comprehensive reports
• Developed analytical frameworks for problem-solving`,
      education: `Master of Science in Analytics
Analytics University | 2017-2019

Bachelor of Science in Mathematics
State University | 2013-2017`,
      skills: 'Quantitative Analysis, Logical Reasoning, Problem Solving, Data Interpretation, Critical Thinking, Analytical Skills, Excel, SQL, Python, R, Statistical Analysis, Pattern Recognition, Decision Making, Time Management',
      projects: `Competitive Exam Preparation Platform
• Developed online platform with 10,000+ practice questions
• Helped 5,000+ students improve their scores by 40%

Logic Puzzle Solver
• Created algorithm solving complex logic puzzles
• Published research paper on optimization techniques`,
      certifications: `Certified Analytics Professional (CAP) (2022)
Six Sigma Green Belt (2023)
Project Management Professional (PMP) (2023)`
    },
    Interview: {
      name: 'Jessica Interview Expert',
      email: 'jessica.expert@email.com',
      phone: '+1 (555) 678-9012',
      summary: 'HR Professional and Career Coach with 5+ years of experience in talent acquisition, interview training, and career development. Expertise in behavioral interviewing, communication skills, and helping candidates succeed in their job search.',
      experience: `Senior HR Manager | Tech Company | 2020-Present
• Conducted 500+ interviews and hired 100+ employees
• Developed interview training program for hiring managers
• Improved candidate experience scores by 45%
• Created structured interview frameworks and assessment tools

Career Coach | Career Services | 2018-2020
• Coached 200+ clients on interview skills and job search strategies
• Conducted mock interviews and provided detailed feedback
• Achieved 85% success rate in client job placements`,
      education: `Master of Science in Human Resources Management
HR University | 2016-2018

Bachelor of Arts in Psychology
Liberal Arts College | 2012-2016`,
      skills: 'Interview Skills, Behavioral Interviewing, Communication Skills, Public Speaking, Presentation Skills, Active Listening, Body Language, Emotional Intelligence, Conflict Resolution, Negotiation, Career Counseling, Resume Writing, LinkedIn Optimization',
      projects: `Interview Preparation Workshop Series
• Designed and delivered workshops to 1,000+ participants
• Achieved 90% satisfaction rating and 75% job offer rate

Mock Interview Platform
• Created online platform for virtual mock interviews
• Served 3,000+ users with AI-powered feedback`,
      certifications: `Professional in Human Resources (PHR) (2022)
Certified Career Coach (CCC) (2021)
SHRM Certified Professional (SHRM-CP) (2023)`
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutoFill = () => {
    const template = domainTemplates[selectedDomain] || domainTemplates.IT;
    setFormData(template);
  };

  const handlePreview = () => {
    if (!formData.name || !formData.email) {
      alert('⚠️ Please fill in at least your name and email before previewing.');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = () => {
    alert('🎉 Resume downloaded successfully! In production, this would generate a professional PDF with ATS-friendly formatting.');
    setShowPreview(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
      animation: 'gradientShift 15s ease infinite',
      backgroundSize: '200% 200%'
    },
    content: {
      padding: '2rem',
      maxWidth: '1000px',
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
    header: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      marginBottom: '2rem',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
    },
    title: {
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.95)',
      fontSize: '1.1rem'
    },
    autoFillBtn: {
      background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '700',
      marginTop: '1rem',
      boxShadow: '0 8px 25px rgba(67, 233, 123, 0.4)',
      transition: 'all 0.3s ease'
    },
    form: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      color: 'white',
      fontSize: '1rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      display: 'block',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    input: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    },
    textarea: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'all 0.3s ease'
    },
    downloadBtn: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      color: 'white',
      padding: '1.25rem 2.5rem',
      borderRadius: '50px',
      border: 'none',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      marginTop: '1.5rem',
      boxShadow: '0 10px 30px rgba(20, 184, 166, 0.5)',
      transition: 'all 0.3s ease'
    },
    previewBtn: {
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: 'white',
      padding: '1.25rem 2.5rem',
      borderRadius: '50px',
      border: 'none',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      marginTop: '1.5rem',
      boxShadow: '0 10px 30px rgba(6, 182, 212, 0.5)',
      transition: 'all 0.3s ease'
    },
    previewOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem',
      overflow: 'auto'
    },
    previewModal: {
      background: 'white',
      borderRadius: '1rem',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
      position: 'relative'
    },
    previewHeader: {
      background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
      padding: '1.5rem 2rem',
      borderRadius: '1rem 1rem 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    previewTitle: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: 0
    },
    closeBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    previewContent: {
      padding: '3rem',
      background: 'white',
      color: '#1e293b',
      fontFamily: 'Georgia, serif'
    },
    resumeHeader: {
      textAlign: 'center',
      borderBottom: '3px solid #0d9488',
      paddingBottom: '1.5rem',
      marginBottom: '2rem'
    },
    resumeName: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#0d9488',
      marginBottom: '0.5rem'
    },
    resumeContact: {
      fontSize: '1rem',
      color: '#64748b',
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap'
    },
    resumeSection: {
      marginBottom: '2rem'
    },
    resumeSectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0d9488',
      borderBottom: '2px solid #14b8a6',
      paddingBottom: '0.5rem',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    resumeText: {
      fontSize: '1rem',
      lineHeight: '1.8',
      color: '#334155',
      whiteSpace: 'pre-wrap'
    },
    previewActions: {
      padding: '1.5rem 2rem',
      background: '#f8fafc',
      borderRadius: '0 0 1rem 1rem',
      display: 'flex',
      gap: '1rem',
      position: 'sticky',
      bottom: 0,
      borderTop: '1px solid #e2e8f0'
    },
    actionBtn: {
      flex: 1,
      padding: '1rem 2rem',
      borderRadius: '0.75rem',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    downloadActionBtn: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
    },
    editActionBtn: {
      background: 'white',
      color: '#0d9488',
      border: '2px solid #0d9488'
    }
  };

  const ResumePreview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.previewOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowPreview(false);
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        style={styles.previewModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.previewHeader}>
          <h2 style={styles.previewTitle}>📄 Resume Preview</h2>
          <button
            onClick={() => setShowPreview(false)}
            style={styles.closeBtn}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'rotate(0deg)';
            }}
          >
            ×
          </button>
        </div>

        <div style={styles.previewContent}>
          {/* Resume Header */}
          <div style={styles.resumeHeader}>
            <h1 style={styles.resumeName}>{formData.name || 'Your Name'}</h1>
            <div style={styles.resumeContact}>
              {formData.email && <span>📧 {formData.email}</span>}
              {formData.phone && <span>📱 {formData.phone}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {formData.summary && (
            <div style={styles.resumeSection}>
              <h2 style={styles.resumeSectionTitle}>Professional Summary</h2>
              <p style={styles.resumeText}>{formData.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {formData.experience && (
            <div style={styles.resumeSection}>
              <h2 style={styles.resumeSectionTitle}>Work Experience</h2>
              <p style={styles.resumeText}>{formData.experience}</p>
            </div>
          )}

          {/* Education */}
          {formData.education && (
            <div style={styles.resumeSection}>
              <h2 style={styles.resumeSectionTitle}>Education</h2>
              <p style={styles.resumeText}>{formData.education}</p>
            </div>
          )}

          {/* Skills */}
          {formData.skills && (
            <div style={styles.resumeSection}>
              <h2 style={styles.resumeSectionTitle}>Skills</h2>
              <p style={styles.resumeText}>{formData.skills}</p>
            </div>
          )}

          {/* Projects */}
          {formData.projects && (
            <div style={styles.resumeSection}>
              <h2 style={styles.resumeSectionTitle}>Projects</h2>
              <p style={styles.resumeText}>{formData.projects}</p>
            </div>
          )}

          {/* Certifications */}
          {formData.certifications && (
            <div style={styles.resumeSection}>
              <h2 style={styles.resumeSectionTitle}>Certifications</h2>
              <p style={styles.resumeText}>{formData.certifications}</p>
            </div>
          )}
        </div>

        <div style={styles.previewActions}>
          <motion.button
            onClick={() => setShowPreview(false)}
            style={{ ...styles.actionBtn, ...styles.editActionBtn }}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(13, 148, 136, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            ✏️ Edit Resume
          </motion.button>
          <motion.button
            onClick={handleDownload}
            style={{ ...styles.actionBtn, ...styles.downloadActionBtn }}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(20, 184, 166, 0.6)' }}
            whileTap={{ scale: 0.98 }}
          >
            📥 Download PDF
          </motion.button>
        </div>
      </motion.div>
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
              background: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>📝 Resume Builder</h1>
          <p style={styles.subtitle}>
            Create a professional ATS-friendly resume with modern keywords
          </p>
          <motion.button
            onClick={handleAutoFill}
            style={styles.autoFillBtn}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 35px rgba(67, 233, 123, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            ✨ Auto-Fill Template for {selectedDomain || 'IT'} Domain
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.form}
        >
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Professional Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Brief summary of your professional background..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Work Experience</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="List your work experience..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Education</label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Your educational background..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="List your skills (comma separated)..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Projects</label>
            <textarea
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              placeholder="Describe your key projects..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Certifications</label>
            <textarea
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="List your certifications..."
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.border = '2px solid rgba(67, 233, 123, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
          </div>

          <motion.button
            onClick={handlePreview}
            style={styles.previewBtn}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 15px 40px rgba(6, 182, 212, 0.7)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            👁️ Preview Resume
          </motion.button>
        </motion.div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && <ResumePreview />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeBuilder;
