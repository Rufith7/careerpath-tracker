import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Roadmap from '../components/Roadmap';
import CareerRecommendation from '../components/CareerRecommendation';
import Quiz from './Quiz';
import Notes from './Notes';
import CareerGuidance from './CareerGuidance';
import ProgressTracking from './ProgressTracking';
import InterviewPrep from './InterviewPrep';
import ResumeBuilder from './ResumeBuilder';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Ensure smooth rendering
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const domains = [
    { 
      id: 'IT', 
      name: 'IT & Web Development', 
      icon: '💻', 
      gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      description: 'Master web development, programming, and software engineering'
    },
    { 
      id: 'DataScience', 
      name: 'Data Science & AI', 
      icon: '📊', 
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      description: 'Learn data analysis, machine learning, and AI technologies'
    },
    { 
      id: 'Healthcare', 
      name: 'Healthcare', 
      icon: '🏥', 
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Medical education and healthcare management'
    },
    { 
      id: 'Finance', 
      name: 'Finance', 
      icon: '💰', 
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      description: 'Financial analysis and business management'
    },
    { 
      id: 'Aptitude', 
      name: 'Aptitude', 
      icon: '🧠', 
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      description: 'Logical reasoning and problem solving'
    },
    { 
      id: 'Interview', 
      name: 'Interview Prep', 
      icon: '🎤', 
      gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      description: 'Master interview skills and techniques'
    }
  ];

  const menuItems = [
    { id: 'home',      label: 'Home',        icon: '🏠', color: '#0d9488' },
    { id: 'quiz',      label: 'AI Quiz',     icon: '🧠', color: '#14b8a6' },
    { id: 'notes',     label: 'Notes',       icon: '📝', color: '#06b6d4' },
    { id: 'career',    label: 'Career',      icon: '🎯', color: '#10b981' },
    { id: 'recommend', label: 'AI Recommend',icon: '🤖', color: '#22c55e' },
    { id: 'progress',  label: 'Progress',    icon: '📊', color: '#0891b2' },
    { id: 'interview', label: 'Interview',   icon: '💼', color: '#14b8a6' },
    { id: 'resume',    label: 'Resume',      icon: '📄', color: '#10b981' }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      animation: 'gradientShift 15s ease infinite',
      backgroundSize: '200% 200%'
    },
    particles: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 0
    },
    header: {
      background: scrolled 
        ? 'rgba(13, 148, 136, 0.95)' 
        : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      padding: scrolled ? '0.75rem 2rem' : '1rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: 'white',
      fontSize: scrolled ? '1.3rem' : '1.5rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    nav: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    navItem: {
      padding: '0.6rem 1.2rem',
      borderRadius: '50px',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      background: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    navItemActive: {
      background: 'rgba(255, 255, 255, 0.25)',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userAvatar: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '700',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      border: '3px solid rgba(255, 255, 255, 0.3)'
    },
    logoutBtn: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)',
      transition: 'all 0.3s ease'
    },
    content: {
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    welcomeCard: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '3rem 2rem',
      marginBottom: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
    },
    title: {
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.75rem',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.95)',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    domainsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem'
    },
    domainCard: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
    },
    domainIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      display: 'block',
      filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))'
    },
    domainName: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '0.75rem',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    domainDesc: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '1.5rem'
    },
    progressBar: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50px',
      height: '12px',
      overflow: 'hidden',
      marginTop: '1rem',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    progressFill: {
      background: 'linear-gradient(90deg, #43e97b, #38f9d7)',
      height: '100%',
      borderRadius: '50px',
      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 0 20px rgba(67, 233, 123, 0.6)'
    },
    progressText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginTop: '0.5rem'
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div style={styles.welcomeCard}>
              <motion.h1
                style={styles.title}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Welcome to CareerPath! 👋
              </motion.h1>
              <p style={styles.subtitle}>
                Choose a domain to start your learning journey
              </p>
            </div>

            <div style={styles.domainsGrid}>
              {domains.map((domain, index) => {
                const progress = { currentLevel: 1 };
                const percentage = (progress.currentLevel / 5) * 100;

                return (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 100
                    }}
                    style={styles.domainCard}
                    onClick={() => {
                      setSelectedDomain(domain.id);
                      setCurrentPage('roadmap');
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                      borderColor: 'rgba(255, 255, 255, 0.5)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      style={styles.domainIcon}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {domain.icon}
                    </motion.div>
                    <h3 style={styles.domainName}>{domain.name}</h3>
                    <p style={styles.domainDesc}>{domain.description}</p>
                    <div style={styles.progressBar}>
                      <motion.div
                        style={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      />
                    </div>
                    <div style={styles.progressText}>
                      Level {progress.currentLevel} of 5 • {percentage}% Complete
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      case 'roadmap':
        return (
          <Roadmap 
            domain={selectedDomain} 
            userProgress={{}}
            onBack={() => setCurrentPage('home')}
            onLevelClick={(level) => {
              setCurrentPage('quiz');
            }}
          />
        );
      case 'quiz':
        return <Quiz selectedDomain={selectedDomain} onBack={() => setCurrentPage('roadmap')} />;
      case 'notes':
        return <Notes onBack={() => setCurrentPage('home')} selectedDomain={selectedDomain} />;
      case 'career':
        return <CareerGuidance selectedDomain={selectedDomain} onBack={() => setCurrentPage('home')} />;
      case 'recommend':
        return <CareerRecommendation onBack={() => setCurrentPage('home')} />;
      case 'progress':
        return <ProgressTracking onBack={() => setCurrentPage('home')} />;
      case 'interview':
        return <InterviewPrep onBack={() => setCurrentPage('home')} />;
      case 'resume':
        return <ResumeBuilder selectedDomain={selectedDomain} onBack={() => setCurrentPage('home')} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Particles - Only render when ready */}
      {isReady && (
        <div style={styles.particles}>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                background: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`,
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)'
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <motion.div
        style={styles.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerContent}>
          <motion.div
            style={styles.logo}
            onClick={() => setCurrentPage('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🎓
            </motion.span>
            <span>CareerPath Tracker</span>
          </motion.div>

          <div style={styles.nav}>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                style={{
                  ...styles.navItem,
                  ...(currentPage === item.id ? styles.navItemActive : {})
                }}
                onClick={() => setCurrentPage(item.id)}
                whileHover={{ 
                  scale: 1.1,
                  background: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div style={styles.userSection}>
            <motion.div
              style={styles.userAvatar}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              🎓
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div style={styles.content}>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
