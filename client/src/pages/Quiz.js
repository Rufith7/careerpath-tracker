import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Static question bank (no backend needed for fallback) ────────────────────
const QUESTION_BANK = {
  JavaScript: [
    { q: 'Which keyword declares a block-scoped variable?', opts: ['var','let','function','static'], ans: 1 },
    { q: 'What does === check?', opts: ['Value only','Type only','Value and type','Reference'], ans: 2 },
    { q: 'What is typeof null?', opts: ['null','undefined','object','number'], ans: 2 },
    { q: 'Which method adds to end of array?', opts: ['push()','pop()','shift()','unshift()'], ans: 0 },
    { q: 'What does JSON.parse() do?', opts: ['Object to string','String to object','Delete JSON','Create file'], ans: 1 },
    { q: 'Which is NOT a JS data type?', opts: ['String','Boolean','Float','Symbol'], ans: 2 },
    { q: 'What does spread operator (...) do?', opts: ['Deletes array','Expands iterable','Creates loop','Declares var'], ans: 1 },
    { q: 'What is a closure?', opts: ['A loop','Function accessing outer scope','An error','A data type'], ans: 1 },
    { q: 'What is Promise used for?', opts: ['Styling','Async operations','Routing','Storage'], ans: 1 },
    { q: 'Which converts array to string?', opts: ['toString()','join()','Both A and B','stringify()'], ans: 2 },
  ],
  React: [
    { q: 'What is JSX?', opts: ['JavaScript XML','Java Syntax','JSON Extension','JS Extra'], ans: 0 },
    { q: 'Which hook manages state?', opts: ['useEffect','useState','useContext','useRef'], ans: 1 },
    { q: 'What is the virtual DOM?', opts: ['Real DOM','Lightweight DOM copy','Server DOM','CSS DOM'], ans: 1 },
    { q: 'Which hook handles side effects?', opts: ['useState','useCallback','useEffect','useMemo'], ans: 2 },
    { q: 'What are props?', opts: ['State variables','Data passed to components','CSS styles','Event handlers'], ans: 1 },
    { q: 'What does key prop do in lists?', opts: ['Styling','Uniquely identifies elements','Adds security','Speeds CSS'], ans: 1 },
    { q: 'What is React.memo for?', opts: ['Memoize components','Create state','Handle events','Fetch data'], ans: 0 },
    { q: 'Default React dev server port?', opts: ['8080','3000','5000','4200'], ans: 1 },
    { q: 'What is context API for?', opts: ['Routing','Global state sharing','Styling','Testing'], ans: 1 },
    { q: 'How to prevent re-render?', opts: ['useEffect','useState','React.memo','useRef'], ans: 2 },
  ],
  Python: [
    { q: 'Python file extension?', opts: ['.py','.python','.pt','.pyt'], ans: 0 },
    { q: 'Keyword to define a function?', opts: ['function','def','func','define'], ans: 1 },
    { q: 'Output of type([])?', opts: ['array','list','tuple','dict'], ans: 1 },
    { q: 'Exponentiation operator?', opts: ['^','**','exp()','pow'], ans: 1 },
    { q: 'Which is mutable?', opts: ['Tuple','String','List','Frozenset'], ans: 2 },
    { q: 'How to create a dictionary?', opts: ['{}','[]','()','<>'], ans: 0 },
    { q: 'Add element to list?', opts: ['add()','append()','insert()','push()'], ans: 1 },
    { q: 'len("Python") = ?', opts: ['5','6','7','Error'], ans: 1 },
    { q: 'Exception handling keyword?', opts: ['try/catch','try/except','catch','handle'], ans: 1 },
    { q: 'Import a module?', opts: ['include','require','import','use'], ans: 2 },
  ],
};

const TOPICS = {
  IT:          ['JavaScript','React','Python','HTML & CSS','Node.js'],
  DataScience: ['Python','Statistics','Machine Learning','SQL','Data Visualization'],
  Healthcare:  ['Anatomy','Pharmacology','Patient Care','Medical Ethics','Nutrition'],
  Finance:     ['Accounting','Investment','Risk Management','Financial Analysis','Economics'],
  Aptitude:    ['Quantitative','Logical Reasoning','Verbal Ability','Data Interpretation'],
  Interview:   ['Behavioral Questions','Technical Questions','Communication','Problem Solving'],
};

// Generate questions locally (no backend needed)
function generateQuestions(topic, count = 10) {
  const bank = QUESTION_BANK[topic];
  if (bank) {
    const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, Math.min(count, bank.length));
    return shuffled.map((item, i) => ({
      id: i,
      question: item.q,
      options: item.opts,
      correctIndex: item.ans,
      explanation: `Correct answer: ${item.opts[item.ans]}`,
    }));
  }
  // Generic fallback for topics without a bank
  return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
    id: i,
    question: `${topic} — Question ${i + 1}: Which of the following is a core concept?`,
    options: ['Fundamentals', 'Advanced Theory', 'Practical Application', 'All of the above'],
    correctIndex: 3,
    explanation: 'All of the above are core concepts.',
  }));
}

export default function Quiz({ selectedDomain: propDomain, onBack }) {
  const [step, setStep]         = useState('setup');   // setup | quiz | results
  const [domain, setDomain]     = useState(propDomain || 'IT');
  const [topic, setTopic]       = useState(TOPICS[propDomain || 'IT'][0]);
  const [level, setLevel]       = useState(1);
  const [difficulty, setDiff]   = useState('Medium');
  const [questions, setQs]      = useState([]);
  const [qIdx, setQIdx]         = useState(0);
  const [answers, setAnswers]   = useState({});   // { qIdx: selectedOptionIndex }
  const [results, setResults]   = useState(null);
  const [elapsed, setElapsed]   = useState(0);
  const [startTs, setStartTs]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [showExpl, setShowExpl] = useState(false); // show explanation after answer

  // Update topic when domain changes
  useEffect(() => {
    setTopic(TOPICS[domain]?.[0] || 'General');
  }, [domain]);

  // Timer
  useEffect(() => {
    if (step !== 'quiz' || !startTs) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTs) / 1000)), 500);
    return () => clearInterval(id);
  }, [step, startTs]);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startQuiz = useCallback(async () => {
    setLoading(true);
    try {
      // Try backend first, fall back to local bank
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, topic, level, difficulty, questionCount: 10 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.quiz?.questions?.length > 0) {
          // Map backend format to our format
          const qs = data.quiz.questions.map((q, i) => ({
            id: i,
            question: q.question,
            options: q.options.map(o => o.text),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
          }));
          setQs(qs);
          setQIdx(0);
          setAnswers({});
          setElapsed(0);
          setStartTs(Date.now());
          setShowExpl(false);
          setStep('quiz');
          return;
        }
      }
    } catch { /* fall through to local */ }

    // Local fallback
    const qs = generateQuestions(topic, 10);
    setQs(qs);
    setQIdx(0);
    setAnswers({});
    setElapsed(0);
    setStartTs(Date.now());
    setShowExpl(false);
    setStep('quiz');
    setLoading(false);
  }, [domain, topic, level, difficulty]);

  // Called when loading finishes after startQuiz sets step
  useEffect(() => { if (step === 'quiz') setLoading(false); }, [step]);

  const selectAnswer = (optIdx) => {
    if (answers[qIdx] !== undefined) return; // already answered
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setShowExpl(true);
  };

  const nextQ = () => {
    setShowExpl(false);
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const answerArray = questions.map((q, i) => ({
      selectedOption: answers[i] ?? -1,
      correctIndex: q.correctIndex,
    }));

    let correct = answerArray.filter(a => a.selectedOption === a.correctIndex).length;
    let score = Math.round((correct / questions.length) * 100);
    let passed = score >= 70;

    // Try to submit to backend for server-side scoring
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerArray }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          score = data.result.score;
          correct = data.result.correctAnswers;
          passed = data.result.passed;
        }
      }
    } catch { /* use local score */ }

    setResults({ score, correct, total: questions.length, passed, timeSpent: elapsed });
    setStep('results');
  };

  const reset = () => {
    setStep('setup');
    setQs([]);
    setQIdx(0);
    setAnswers({});
    setResults(null);
    setElapsed(0);
    setStartTs(null);
    setShowExpl(false);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const card = {
    background: 'rgba(255,255,255,0.13)',
    backdropFilter: 'blur(18px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(255,255,255,0.25)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    maxWidth: '780px',
    margin: '0 auto',
  };
  const btnPrimary = {
    background: 'linear-gradient(135deg,#14b8a6,#22c55e)',
    color: '#fff', padding: '0.85rem 2rem', borderRadius: '0.75rem',
    border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
  };
  const btnGhost = {
    background: 'rgba(255,255,255,0.12)', color: '#fff',
    padding: '0.85rem 2rem', borderRadius: '0.75rem',
    border: '2px solid rgba(255,255,255,0.3)', fontSize: '1rem',
    fontWeight: 600, cursor: 'pointer',
  };
  const selectStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
    border: '2px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.12)', color: '#fff',
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
    marginBottom: '1.25rem',
  };
  const labelStyle = {
    display: 'block', color: '#fff', fontWeight: 600,
    marginBottom: '0.4rem', fontSize: '0.95rem',
  };

  const currentQ = questions[qIdx];
  const answered = answers[qIdx] !== undefined;
  const answeredCount = Object.keys(answers).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <AnimatePresence mode="wait">

        {/* ══════════════ SETUP ══════════════ */}
        {step === 'setup' && (
          <motion.div key="setup"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} style={card}
          >
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, textAlign: 'center', margin: '0 0 0.4rem' }}>
              🧠 AI Quiz Engine
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: '2rem' }}>
              Score 70% or above to pass and unlock the next level!
            </p>

            <label style={labelStyle}>Domain</label>
            <select style={selectStyle} value={domain} onChange={e => setDomain(e.target.value)}>
              <option value="IT">Information Technology</option>
              <option value="DataScience">Data Science</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Aptitude">Aptitude & Reasoning</option>
              <option value="Interview">Interview Preparation</option>
            </select>

            <label style={labelStyle}>Topic</label>
            <select style={selectStyle} value={topic} onChange={e => setTopic(e.target.value)}>
              {(TOPICS[domain] || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <label style={labelStyle}>Level</label>
            <select style={selectStyle} value={level} onChange={e => setLevel(Number(e.target.value))}>
              {[1,2,3,4,5].map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>

            <label style={labelStyle}>Difficulty</label>
            <select style={{ ...selectStyle, marginBottom: '2rem' }} value={difficulty} onChange={e => setDiff(e.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <div style={{ textAlign: 'center' }}>
              <button style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, fontSize: '1.1rem', padding: '1rem 3rem' }}
                onClick={startQuiz} disabled={loading}>
                {loading ? '⏳ Loading…' : '🚀 Start Quiz'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ══════════════ QUIZ ══════════════ */}
        {step === 'quiz' && currentQ && (
          <motion.div key={`q-${qIdx}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
            style={card}
          >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>
                Question {qIdx + 1} / {questions.length}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>⏱️ {fmt(elapsed)}</span>
            </div>

            {/* Progress bar */}
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '50px', height: '8px', marginBottom: '1.75rem', overflow: 'hidden' }}>
              <motion.div
                style={{ background: 'linear-gradient(90deg,#14b8a6,#22c55e)', height: '100%', borderRadius: '50px' }}
                animate={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Question */}
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.65, margin: 0 }}>
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[qIdx] === i;
                const isCorrect  = i === currentQ.correctIndex;
                let bg = 'rgba(255,255,255,0.08)';
                let border = '2px solid rgba(255,255,255,0.2)';
                if (answered) {
                  if (isCorrect)       { bg = 'rgba(34,197,94,0.25)';  border = '2px solid #22c55e'; }
                  else if (isSelected) { bg = 'rgba(239,68,68,0.25)';  border = '2px solid #ef4444'; }
                } else if (isSelected) {
                  bg = 'rgba(20,184,166,0.25)'; border = '2px solid #14b8a6';
                }

                return (
                  <motion.div key={i}
                    onClick={() => selectAnswer(i)}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', border, background: bg, color: '#fff', cursor: answered ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', transition: 'background 0.2s, border 0.2s' }}
                  >
                    <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: answered && isCorrect ? '#22c55e' : answered && isSelected ? '#ef4444' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                      {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ fontSize: '0.97rem', lineHeight: 1.4 }}>{opt}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExpl && answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem', borderLeft: '4px solid #14b8a6' }}
                >
                  <p style={{ color: '#a7f3d0', fontWeight: 700, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>💡 Explanation</p>
                  <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '0.92rem' }}>{currentQ.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ ...btnGhost, opacity: qIdx === 0 ? 0.4 : 1 }}
                onClick={() => { if (qIdx > 0) { setQIdx(i => i - 1); setShowExpl(answers[qIdx - 1] !== undefined); } }}
                disabled={qIdx === 0}>
                ← Back
              </button>

              {answered && (
                <button style={btnPrimary} onClick={nextQ}>
                  {qIdx === questions.length - 1 ? '✅ Submit Quiz' : 'Next →'}
                </button>
              )}
            </div>

            {/* Answered count */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>
              {answeredCount} / {questions.length} answered
            </p>
          </motion.div>
        )}

        {/* ══════════════ RESULTS ══════════════ */}
        {step === 'results' && results && (
          <motion.div key="results"
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} style={{ ...card, textAlign: 'center' }}
          >
            <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 1.5rem' }}>
              {results.passed ? '🎉 Quiz Passed!' : '📚 Quiz Complete'}
            </h2>

            {/* Score circle */}
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: results.passed ? 'linear-gradient(135deg,#14b8a6,#22c55e)' : 'linear-gradient(135deg,#f97316,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <span style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 900 }}>{results.score}%</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#a7f3d0', fontSize: '1.5rem', fontWeight: 800 }}>{results.correct}/{results.total}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#a7f3d0', fontSize: '1.5rem', fontWeight: 800 }}>{fmt(results.timeSpent)}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>Time</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: results.passed ? '#86efac' : '#fca5a5', fontSize: '1.5rem', fontWeight: 800 }}>
                  {results.passed ? 'PASS' : 'FAIL'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>Result</div>
              </div>
            </div>

            {/* Pass / Fail message */}
            {results.passed ? (
              <div style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1.75rem' }}>
                <p style={{ color: '#86efac', fontWeight: 700, margin: '0 0 0.25rem' }}>🔓 Level {level + 1} Unlocked!</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.92rem' }}>Great work! You can now attempt the next level.</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1.75rem' }}>
                <p style={{ color: '#fca5a5', fontWeight: 700, margin: '0 0 0.25rem' }}>You need 70% to pass.</p>
                <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.92rem' }}>Review the topic and try again — you've got this!</p>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={btnPrimary} onClick={reset}>Try Another Quiz</button>
              {results.passed && (
                <button style={btnGhost} onClick={() => { setLevel(l => l + 1); reset(); }}>
                  Level {level + 1} →
                </button>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
