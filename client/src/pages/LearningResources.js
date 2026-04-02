import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const LearningResources = ({ onBack }) => {
  const [selectedDomain, setSelectedDomain] = useState('IT');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5001';

  useEffect(() => {
    fetchResources();
  }, [selectedDomain]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchResources = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/domains`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const domain = response.data.find(d => d.id === selectedDomain);
      if (domain && domain.resources) {
        setResources(domain.resources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const domains = [
    { id: 'IT', name: 'IT & Web Dev', icon: '💻' },
    { id: 'DataScience', name: 'Data Science', icon: '📊' },
    { id: 'Healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'Finance', name: 'Finance', icon: '💰' },
    { id: 'Aptitude', name: 'Aptitude', icon: '🧠' },
    { id: 'Interview', name: 'Interview', icon: '🎤' }
  ];

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
      marginBottom: '0.5rem',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1.1rem'
    },
    domainTabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    domainTab: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    domainTabActive: {
      background: 'rgba(255, 255, 255, 0.25)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    resourcesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    resourceCard: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    resourceTitle: {
      color: 'white',
      fontSize: '1.4rem',
      fontWeight: 'bold',
      marginBottom: '0.75rem',
      textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
    },
    resourceDescription: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '1rem'
    },
    resourceMeta: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    },
    badge: {
      display: 'inline-block',
      padding: '0.4rem 0.8rem',
      borderRadius: '0.5rem',
      fontSize: '0.85rem',
      fontWeight: '600',
      background: 'rgba(34, 197, 94, 0.3)',
      color: '#86efac',
      border: '1px solid rgba(34, 197, 94, 0.5)'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.25)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none'
    },
    loading: {
      textAlign: 'center',
      color: 'white',
      fontSize: '1.5rem',
      padding: '3rem'
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
            marginBottom: '1.5rem'
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
          <h1 style={styles.title}>📚 Learning Resources</h1>
          <p style={styles.subtitle}>
            Curated learning materials from top platforms - All Free!
          </p>
        </motion.div>

        {/* Domain Tabs */}
        <div style={styles.domainTabs}>
          {domains.map((domain) => (
            <motion.div
              key={domain.id}
              style={{
                ...styles.domainTab,
                ...(selectedDomain === domain.id ? styles.domainTabActive : {})
              }}
              onClick={() => setSelectedDomain(domain.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{domain.icon}</span>
              <span>{domain.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div style={styles.loading}>Loading resources...</div>
        ) : (
          <div style={styles.resourcesGrid}>
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                style={styles.resourceCard}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
              >
                <h3 style={styles.resourceTitle}>{resource.title}</h3>
                <p style={styles.resourceDescription}>{resource.description}</p>
                
                <div style={styles.resourceMeta}>
                  {resource.isFree && (
                    <span style={styles.badge}>✨ Free</span>
                  )}
                  {resource.certificate && (
                    <span style={{ ...styles.badge, background: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.5)' }}>
                      🎓 {resource.certificate}
                    </span>
                  )}
                  {resource.rating && (
                    <span style={{ ...styles.badge, background: 'rgba(249, 115, 22, 0.3)', color: '#fdba74', border: '1px solid rgba(249, 115, 22, 0.5)' }}>
                      ⭐ {resource.rating}
                    </span>
                  )}
                </div>

                <motion.a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.button}
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Visit Resource</span>
                  <span>🔗</span>
                </motion.a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;
