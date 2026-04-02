import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: 'Hello! 👋 I\'m your AI Career Assistant. How can I help you today?'
    }
  ]);

  const quickReplies = [
    '🧠 Quiz tips',
    '📚 Resources',
    '🎯 Career advice',
    '💼 Interview help'
  ];

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('quiz') || msg.includes('test')) {
      return '🧠 Quiz Tips:\n\n• Read questions carefully\n• Start with easier questions\n• Aim for 70%+ to unlock next level\n• Review feedback after each quiz\n• Practice regularly\n\nGood luck!';
    }
    
    if (msg.includes('resource') || msg.includes('learn')) {
      return '📚 Learning Resources:\n\nWe have curated resources from top platforms like freeCodeCamp, Khan Academy, and more. All resources are FREE!\n\nClick on any domain to see resources.';
    }
    
    if (msg.includes('career') || msg.includes('job')) {
      return '🎯 Career Guidance:\n\nI can help you with:\n• Career path recommendations\n• Skill development roadmap\n• Industry insights\n• Job market trends\n\nWhat would you like to know?';
    }
    
    if (msg.includes('interview')) {
      return '💼 Interview Preparation:\n\nKey tips:\n1. Research the company\n2. Practice STAR method\n3. Prepare questions\n4. Be confident\n5. Follow up\n\nNeed specific help?';
    }
    
    return '🤔 I can help you with:\n\n🧠 Quiz strategies\n📚 Learning resources\n🎯 Career guidance\n💼 Interview prep\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: message }]);
    setMessage('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: getAIResponse(message)
      }]);
    }, 500);
  };

  const styles = {
    button: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      color: 'white',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '360px',
      height: '550px',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600'
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    messagesContainer: {
      flex: 1,
      padding: '1rem',
      overflowY: 'auto',
      background: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    message: {
      maxWidth: '80%',
      padding: '0.75rem 1rem',
      borderRadius: '1rem',
      fontSize: '0.9rem',
      lineHeight: '1.4',
      whiteSpace: 'pre-line'
    },
    userMessage: {
      alignSelf: 'flex-end',
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      color: 'white'
    },
    aiMessage: {
      alignSelf: 'flex-start',
      background: 'white',
      color: '#1f2937',
      border: '1px solid #e5e7eb'
    },
    quickReplies: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.75rem',
      overflowX: 'auto',
      background: 'white',
      borderTop: '1px solid #e5e7eb'
    },
    quickReply: {
      padding: '0.5rem 1rem',
      borderRadius: '1rem',
      background: '#f3f4f6',
      color: '#374151',
      fontSize: '0.8rem',
      fontWeight: '600',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      border: '1px solid #e5e7eb'
    },
    inputContainer: {
      padding: '1rem',
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: '0.75rem'
    },
    input: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      outline: 'none',
      fontSize: '0.9rem'
    },
    sendButton: {
      padding: '0.75rem 1.25rem',
      borderRadius: '0.5rem',
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.9rem'
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        style={styles.button}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🤖
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        style={styles.container}
      >
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <span>🤖</span>
            <span>AI Assistant</span>
          </div>
          <button
            style={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.type === 'user' ? styles.userMessage : styles.aiMessage)
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={styles.quickReplies}>
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              style={styles.quickReply}
              onClick={() => {
                setMessage(reply);
                setTimeout(() => handleSend(), 100);
              }}
            >
              {reply}
            </button>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            style={styles.input}
          />
          <button
            style={styles.sendButton}
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
