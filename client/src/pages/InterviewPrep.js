import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  {
    category: 'Before the Interview',
    icon: '📋',
    color: 'linear-gradient(135deg,#0d9488,#14b8a6)',
    tips: [
      'Research the company thoroughly — mission, products, recent news, and culture.',
      'Study the job description and map your skills to each requirement.',
      'Prepare 8–10 STAR stories covering leadership, conflict, failure, and success.',
      'Practice answers out loud, not just in your head.',
      'Prepare 3–5 thoughtful questions to ask the interviewer.',
      'Plan your outfit the night before and arrive 10 minutes early.',
    ],
  },
  {
    category: 'During the Interview',
    icon: '🎯',
    color: 'linear-gradient(135deg,#0891b2,#06b6d4)',
    tips: [
      'Start with a confident handshake and maintain good eye contact.',
      'Listen carefully to each question before answering — it\'s okay to pause.',
      'Use the STAR method: Situation → Task → Action → Result.',
      'Be specific with numbers and outcomes ("increased sales by 30%").',
      'Show enthusiasm — interviewers hire people they want to work with.',
      'If you don\'t know something, say so honestly and explain how you\'d find out.',
    ],
  },
  {
    category: 'Body Language',
    icon: '🧍',
    color: 'linear-gradient(135deg,#10b981,#059669)',
    tips: [
      'Sit up straight — good posture signals confidence.',
      'Nod occasionally to show you\'re engaged and listening.',
      'Avoid crossing your arms — it can appear defensive.',
      'Smile naturally — it makes you more likeable and approachable.',
      'Mirror the interviewer\'s energy level subtly.',
      'Keep your hands visible and use them to emphasise points.',
    ],
  },
  {
    category: 'Common Questions',
    icon: '❓',
    color: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    tips: [
      '"Tell me about yourself" — 2-minute pitch: past, present, future.',
      '"Why this company?" — Show genuine research and alignment with values.',
      '"Greatest weakness?" — Pick a real one and show how you\'re improving it.',
      '"Where do you see yourself in 5 years?" — Align with the role\'s growth path.',
      '"Why should we hire you?" — Summarise your top 3 differentiators.',
      '"Tell me about a failure" — Own it, show what you learned, and what changed.',
    ],
  },
  {
    category: 'After the Interview',
    icon: '✉️',
    color: 'linear-gradient(135deg,#f59e0b,#d97706)',
    tips: [
      'Send a thank-you email within 24 hours — personalise it with something discussed.',
      'Reflect on what went well and what you\'d improve for next time.',
      'Follow up politely if you haven\'t heard back within the stated timeline.',
      'Keep applying — don\'t put all your hopes on one opportunity.',
      'Ask for feedback if you\'re rejected — most companies will share it.',
    ],
  },
];

const RESOURCES = [
  {
    title: 'Google Interview Warmup',
    icon: '🤖',
    description: 'AI-powered tool that transcribes your spoken answers and gives instant feedback on vocabulary, filler words, and structure.',
    url: 'https://grow.google/grow-your-career/articles/interview-tips/',
    tag: 'AI Practice',
    tagColor: 'rgba(34,197,94,0.3)',
    tagBorder: 'rgba(34,197,94,0.5)',
    tagText: '#86efac',
    free: true,
  },
  {
    title: 'Pramp — Peer Mock Interviews',
    icon: '🤝',
    description: 'Free peer-to-peer mock interviews. Get paired with another candidate, interview each other, and give structured feedback.',
    url: 'https://www.pramp.com/',
    tag: 'Mock Interviews',
    tagColor: 'rgba(59,130,246,0.3)',
    tagBorder: 'rgba(59,130,246,0.5)',
    tagText: '#93c5fd',
    free: true,
  },
  {
    title: 'Big Interview (YouTube)',
    icon: '🎬',
    description: 'The best YouTube channel for learning exactly what recruiters look for. Covers "Tell me about yourself", salary negotiation, and more.',
    url: 'https://www.youtube.com/@BigInterview',
    tag: 'Video Tutorials',
    tagColor: 'rgba(239,68,68,0.3)',
    tagBorder: 'rgba(239,68,68,0.5)',
    tagText: '#fca5a5',
    free: true,
  },
  {
    title: 'Great Learning — Interview Prep',
    icon: '📖',
    description: 'Free courses on Interview Etiquettes, HR Interview Questions, and the STAR Method for behavioural interviews.',
    url: 'https://www.mygreatlearning.com/academy/learn-for-free/courses/interview-preparation',
    tag: 'Free Course',
    tagColor: 'rgba(168,85,247,0.3)',
    tagBorder: 'rgba(168,85,247,0.5)',
    tagText: '#d8b4fe',
    free: true,
  },
  {
    title: 'LeetCode',
    icon: '💻',
    description: 'The go-to platform for technical interview preparation. Practice DSA problems categorised by company, difficulty, and topic.',
    url: 'https://leetcode.com/',
    tag: 'Technical',
    tagColor: 'rgba(245,158,11,0.3)',
    tagBorder: 'rgba(245,158,11,0.5)',
    tagText: '#fcd34d',
    free: true,
  },
  {
    title: 'Glassdoor Interview Questions',
    icon: '🔍',
    description: 'Real interview questions shared by candidates for thousands of companies. Filter by company, role, and difficulty.',
    url: 'https://www.glassdoor.com/Interview/index.htm',
    tag: 'Real Questions',
    tagColor: 'rgba(20,184,166,0.3)',
    tagBorder: 'rgba(20,184,166,0.5)',
    tagText: '#5eead4',
    free: true,
  },
  {
    title: 'InterviewBit',
    icon: '⚡',
    description: 'Structured interview preparation with coding challenges, mock assessments, and company-specific practice tracks.',
    url: 'https://www.interviewbit.com/',
    tag: 'Structured Prep',
    tagColor: 'rgba(16,185,129,0.3)',
    tagBorder: 'rgba(16,185,129,0.5)',
    tagText: '#6ee7b7',
    free: true,
  },
  {
    title: 'LinkedIn Interview Prep',
    icon: '💼',
    description: 'Practice common interview questions with AI feedback on your recorded video answers. Directly tied to job applications.',
    url: 'https://www.linkedin.com/interview-prep/',
    tag: 'Video Practice',
    tagColor: 'rgba(59,130,246,0.3)',
    tagBorder: 'rgba(59,130,246,0.5)',
    tagText: '#93c5fd',
    free: true,
  },
];

const STAR_STEPS = [
  { letter: 'S', word: 'Situation', color: '#14b8a6', desc: 'Set the scene. Describe the context and background of the situation you were in.' },
  { letter: 'T', word: 'Task', color: '#06b6d4', desc: 'Explain your responsibility. What was your role and what were you expected to achieve?' },
  { letter: 'A', word: 'Action', color: '#10b981', desc: 'Describe the specific steps YOU took. Use "I" not "we". Focus on your contribution.' },
  { letter: 'R', word: 'Result', color: '#22c55e', desc: 'Share the outcome. Quantify where possible — numbers, percentages, time saved.' },
];

export default function InterviewPrep({ onBack }) {
  const [activeTab, setActiveTab] = useState('tips');
  const [expandedTip, setExpandedTip] = useState(null);

  const tabs = [
    { id: 'tips',      label: 'Tips & Strategies', icon: '💡' },
    { id: 'star',      label: 'STAR Method',        icon: '⭐' },
    { id: 'resources', label: 'Resources',          icon: '🔗' },
  ];

  return (
    <motion.div
      key="interview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          💼 Interview Preparation
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
          Everything you need to walk in confident and walk out with an offer
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '50px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── TIPS TAB ── */}
        {activeTab === 'tips' && (
          <motion.div
            key="tips"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.25rem' }}
          >
            {TIPS.map((section, i) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.25)', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                whileHover={{ y: -4 }}
              >
                {/* Card header */}
                <div style={{ background: section.color, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{section.icon}</span>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{section.category}</h3>
                </div>

                {/* Tips list */}
                <ul style={{ margin: 0, padding: '1.25rem 1.5rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {section.tips.map((tip, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <span style={{ color: '#5eead4', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.92rem', lineHeight: 1.55 }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── STAR TAB ── */}
        {activeTab === 'star' && (
          <motion.div
            key="star"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Intro card */}
            <div style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: '1.25rem', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.25)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>⭐ The STAR Method</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                STAR is the gold-standard framework for answering behavioural interview questions like
                "Tell me about a time when…". It keeps your answer structured, concise, and impactful.
              </p>
            </div>

            {/* STAR steps */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {STAR_STEPS.map((s, i) => (
                <motion.div
                  key={s.letter}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: '1.25rem', padding: '1.75rem', border: `2px solid ${s.color}40`, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                  whileHover={{ y: -4 }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', boxShadow: `0 4px 16px ${s.color}60` }}>
                    {s.letter}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{s.word}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Example */}
            <div style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: '1.25rem', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.25)' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 1rem' }}>📝 Example Answer</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                Question: "Tell me about a time you had to meet a tight deadline."
              </p>
              {[
                { label: 'S — Situation', color: '#14b8a6', text: 'During my final year project, our team of four had to deliver a working prototype in 48 hours after a key member fell ill.' },
                { label: 'T — Task', color: '#06b6d4', text: 'As the team lead, I had to redistribute the workload and ensure we still met the client demo deadline.' },
                { label: 'A — Action', color: '#10b981', text: 'I broke the remaining work into 6-hour sprints, reassigned tasks based on each member\'s strengths, and set up hourly check-ins to catch blockers early.' },
                { label: 'R — Result', color: '#22c55e', text: 'We delivered the prototype on time. The client was impressed and awarded us the highest grade in the cohort.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
                  <span style={{ background: item.color, color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem' }}>{item.label}</span>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESOURCES TAB ── */}
        {activeTab === 'resources' && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.25rem' }}
          >
            {RESOURCES.map((res, i) => (
              <motion.div
                key={res.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: '1.25rem', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{res.icon}</span>
                  <div>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{res.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600, background: res.tagColor, color: res.tagText, border: `1px solid ${res.tagBorder}` }}>
                        {res.tag}
                      </span>
                      {res.free && (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(34,197,94,0.2)', color: '#86efac', border: '1px solid rgba(34,197,94,0.4)' }}>
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {res.description}
                </p>

                <motion.a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', padding: '0.7rem 1rem', borderRadius: '0.75rem', border: '2px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', marginTop: 'auto' }}
                  whileHover={{ background: 'rgba(255,255,255,0.28)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Visit Resource →
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
