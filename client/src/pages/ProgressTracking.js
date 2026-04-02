import React from 'react';
import { motion } from 'framer-motion';

const ProgressTracking = ({ onBack }) => {

  const domains = ['IT', 'DataScience', 'Healthcare', 'Finance', 'Aptitude', 'Interview'];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      animation: 'gradientShift 15s ease infinite',
      backgroundSize: '200% 200%'
    },
    content: {
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    title: {
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    progressGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    progressCard: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    domainName: {
      color: 'white',
      fontSize: '1.4rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    levelInfo: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1.1rem',
      marginBottom: '1rem'
    },
    progressBar: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem',
      height: '12px',
      overflow: 'hidden',
      marginBottom: '0.5rem'
    },
    progressFill: {
      background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
      height: '100%',
      borderRadius: '1rem',
      transition: 'width 0.5s ease'
    }
  };

  return (
    <div style={styles.container}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            marginLeft: '2rem',
            marginTop: '1rem'
          }}
        >
          ← Back
        </button>
      )}
      
      <div style={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>📊 Progress Tracking</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            Monitor your learning journey across all domains
          </p>
        </motion.div>

        <div style={styles.progressGrid}>
          {domains.map((domain, index) => {
            const progress = { currentLevel: 1, unlockedLevels: [1] };
            const percentage = (progress.currentLevel / 5) * 100;

            return (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                style={styles.progressCard}
              >
                <h3 style={styles.domainName}>{domain}</h3>
                <div style={styles.levelInfo}>
                  Level {progress.currentLevel} of 5
                </div>
                <div style={styles.progressBar}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                    style={styles.progressFill}
                  />
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                  {percentage.toFixed(0)}% Complete
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
