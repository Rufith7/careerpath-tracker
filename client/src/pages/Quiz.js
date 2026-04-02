import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// API Base URL
const API_BASE_URL = 'http://localhost:5001';

// Helper function for fetch requests with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection.');
    }
    
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5001.');
    }
    
    throw error;
  }
};

const Quiz = ({ selectedDomain: propDomain, onBack }) => {
  const [currentStep, setCurrentStep] = useState('selection');
  const [selectedDomain, setSelectedDomain] = useState(propDomain || 'IT');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopicsAndProgress = async () => {
      if (selectedDomain) {
        await fetchTopics();
        await fetchUserProgress();
      }
    };
    fetchTopicsAndProgress();
  }, [selectedDomain]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let interval;
    if (currentStep === 'quiz' && startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, startTime]);

  const fetchTopics = async () => {
    try {
      setError(null);
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/quiz/topics/${selectedDomain}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.topics) {
          setTopics(data.topics);
          if (data.topics.length > 0 && !selectedTopic) setSelectedTopic(data.topics[0]);
        }
      } else {
        throw new Error('Failed to load topics');
      }
    } catch (error) {
      // Fallback topics
      const fallback = {
        IT:          ['JavaScript', 'React', 'HTML & CSS', 'Node.js', 'Python'],
        DataScience: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
        Healthcare:  ['Anatomy', 'Pharmacology', 'Patient Care', 'Medical Ethics'],
        Finance:     ['Accounting', 'Investment', 'Risk Management', 'Economics'],
        Aptitude:    ['Quantitative', 'Logical Reasoning', 'Verbal Ability'],
        Interview:   ['Behavioral Questions', 'Technical Questions', 'Communication']
      };
      const t = fallback[selectedDomain] || ['General'];
      setTopics(t);
      if (!selectedTopic) setSelectedTopic(t[0]);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/progress`);
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data || {});
      }
    } catch {
      setUserProgress({});
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: selectedDomain,
          topic: selectedTopic,
          level: selectedLevel,
          difficulty: selectedDifficulty,
          questionCount: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuiz(data.quiz);
          setCurrentQuestion(0);
          setAnswers([]);
          setStartTime(Date.now());
          setTimeSpent(0);
          setCurrentStep('quiz');
        } else {
          setError(data.message || 'Error generating quiz.');
        }
      } else {
        setError('Error generating quiz. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Error generating quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    console.log(`Answer selected for question ${currentQuestion}: option ${optionIndex}`);
    const newAnswers = [...answers];
    const currentTime = Date.now();
    const questionStartTime = startTime + (timeSpent * 1000);
    
    newAnswers[currentQuestion] = {
      questionId: quiz.questions[currentQuestion]._id,
      selectedOption: optionIndex,
      timeSpent: Math.floor((currentTime - questionStartTime) / 1000)
    };
    
    setAnswers(newAnswers);
    console.log('Updated answers:', newAnswers);
    
    // Auto-advance to next question after a short delay (optional)
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 500);
  };

  const nextQuestion = () => {
    console.log(`Moving from question ${currentQuestion} to ${currentQuestion + 1}`);
    console.log(`Total questions: ${quiz?.questions?.length}`);
    console.log(`Current answers:`, answers);
    
    // Check if current question is answered
    if (!answers[currentQuestion]) {
      alert('Please select an answer before proceeding.');
      return;
    }
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      console.log(`Advanced to question ${currentQuestion + 1}`);
    } else {
      console.log('Submitting quiz - reached last question');
      submitQuiz();
    }
  };

  const previousQuestion = () => {
    console.log(`Moving from question ${currentQuestion} to ${currentQuestion - 1}`);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      console.log(`Moved back to question ${currentQuestion - 1}`);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, domain: selectedDomain, level: selectedLevel })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResults(data.result);
          setCurrentStep('results');
          fetchUserProgress();
        } else {
          setError(data.message || 'Error submitting quiz.');
        }
      } else {
        setError('Error submitting quiz. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Error submitting quiz.');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep('selection');
    setQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
    setTimeSpent(0);
    setStartTime(null);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
      animation: 'gradientShift 15s ease infinite',
      backgroundSize: '200% 200%'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '800px',
      margin: '0 auto'
    },
    title: {
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.2rem',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: 'block'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '1rem'
    },
    button: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      margin: '0.5rem'
    },
    buttonSecondary: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      margin: '0.5rem'
    },
    questionCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      padding: '2rem',
      marginBottom: '2rem'
    },
    questionText: {
      color: 'white',
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    option: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      margin: '0.5rem 0',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    optionSelected: {
      background: 'rgba(20, 184, 166, 0.3)',
      border: '2px solid #14b8a6'
    },
    progressBar: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem',
      height: '0.5rem',
      marginBottom: '2rem',
      overflow: 'hidden'
    },
    progressFill: {
      background: 'linear-gradient(135deg, #14b8a6, #22c55e)',
      height: '100%',
      borderRadius: '1rem',
      transition: 'width 0.3s ease'
    },
    timer: {
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '1rem'
    },
    resultsCard: {
      textAlign: 'center'
    },
    scoreCircle: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: 'conic-gradient(from 0deg, #22c55e 0%, #22c55e var(--percentage), rgba(255,255,255,0.2) var(--percentage))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '2rem auto',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'white'
    },
    feedback: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      padding: '1rem',
      margin: '1rem 0',
      textAlign: 'left'
    },
    levelIndicator: {
      display: 'inline-block',
      background: 'rgba(34, 197, 94, 0.2)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: '#86efac',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.8rem',
      margin: '0.25rem'
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvailableLevels = () => {
    const domainProgress = userProgress[selectedDomain];
    if (!domainProgress) return [1];
    return domainProgress.unlockedLevels || [1];
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
            marginTop: '2rem'
          }}
        >
          ← Back to Roadmap
        </button>
      )}
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {currentStep === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            style={styles.card}
          >
            <h1 style={styles.title}>🧠 AI Quiz Engine</h1>
            <p style={styles.subtitle}>
              Test your knowledge with AI-generated quizzes. Pass with 70% to unlock the next level!
            </p>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                padding: '1rem',
                margin: '1rem 0',
                color: '#fca5a5',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Domain:</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                style={styles.select}
              >
                <option value="IT">Information Technology</option>
                <option value="DataScience">Data Science</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Aptitude">Aptitude & Reasoning</option>
                <option value="Interview">Interview Preparation</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Topic:</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                style={styles.select}
              >
                {topics && topics.length > 0 ? (
                  topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))
                ) : (
                  <option value="">Loading topics...</option>
                )}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                style={styles.select}
              >
                {getAvailableLevels().map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
              <div style={{ marginTop: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(level => (
                  <span
                    key={level}
                    style={{
                      ...styles.levelIndicator,
                      background: getAvailableLevels().includes(level) 
                        ? 'rgba(34, 197, 94, 0.2)' 
                        : 'rgba(156, 163, 175, 0.2)',
                      color: getAvailableLevels().includes(level) 
                        ? '#86efac' 
                        : '#9ca3af'
                    }}
                  >
                    Level {level} {getAvailableLevels().includes(level) ? '🔓' : '🔒'}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={styles.select}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={generateQuiz}
                disabled={loading || !selectedTopic}
                style={styles.button}
              >
                {loading ? 'Generating Quiz...' : 'Start Quiz 🚀'}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'quiz' && quiz && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            style={styles.card}
          >
            <div style={styles.timer}>
              ⏱️ Time: {formatTime(timeSpent)} | Question {currentQuestion + 1} of {quiz.questions.length}
            </div>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`
                }}
              />
            </div>

            <div style={styles.questionCard}>
              <div style={styles.questionText}>
                {quiz.questions[currentQuestion].question}
              </div>

              {quiz.questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  style={{
                    ...styles.option,
                    ...(answers[currentQuestion]?.selectedOption === index ? styles.optionSelected : {})
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option.text}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              {currentQuestion > 0 && (
                <button onClick={previousQuestion} style={styles.buttonSecondary}>
                  ← Previous
                </button>
              )}
              
              <button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]}
                style={{
                  ...styles.button,
                  opacity: answers[currentQuestion] ? 1 : 0.5
                }}
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next →'}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{ ...styles.card, ...styles.resultsCard }}
          >
            <h2 style={styles.title}>Quiz Results</h2>

            <div
              style={{
                ...styles.scoreCircle,
                '--percentage': `${(results.score / 100) * 360}deg`
              }}
            >
              {results.score}%
            </div>

            <div style={{ color: 'white', fontSize: '1.2rem', marginBottom: '2rem' }}>
              <div>✅ Correct: {results.correctAnswers}/{results.totalQuestions}</div>
              <div>⏱️ Time: {formatTime(results.timeSpent)}</div>
              <div>
                {results.passed ? (
                  <span style={{ color: '#22c55e' }}>🎉 Passed!</span>
                ) : (
                  <span style={{ color: '#ef4444' }}>❌ Failed</span>
                )}
              </div>
            </div>

            {results.nextLevelUnlocked && (
              <div style={{
                ...styles.feedback,
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ color: '#86efac', fontWeight: 'bold' }}>
                  🔓 Level {selectedLevel + 1} Unlocked!
                </div>
                <div style={{ color: 'white' }}>
                  Excellent work! You can now access the next level.
                </div>
              </div>
            )}

            {results.feedback && (
              <div style={styles.feedback}>
                <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
                  📝 Feedback:
                </div>
                {results.feedback.strengths?.map((strength, index) => (
                  <div key={index} style={{ color: '#86efac', marginBottom: '0.5rem' }}>
                    ✅ {strength}
                  </div>
                ))}
                {results.feedback.weaknesses?.map((weakness, index) => (
                  <div key={index} style={{ color: '#fca5a5', marginBottom: '0.5rem' }}>
                    ⚠️ {weakness}
                  </div>
                ))}
                {results.feedback.recommendations?.map((rec, index) => (
                  <div key={index} style={{ color: '#93c5fd', marginBottom: '0.5rem' }}>
                    💡 {rec}
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <button onClick={resetQuiz} style={styles.button}>
                Take Another Quiz
              </button>
              
              {results.nextLevelUnlocked && (
                <button
                  onClick={() => {
                    setSelectedLevel(selectedLevel + 1);
                    resetQuiz();
                  }}
                  style={styles.button}
                >
                  Try Level {selectedLevel + 1} 🚀
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
            <div>AI is generating your quiz...</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;