import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DOMAIN_CAREERS = {
  IT: [
    { id: 'web-dev', title: 'Full-Stack Web Developer', icon: '💻', salary: '$70k – $130k', demand: 'Very High', skills: ['HTML/CSS','JavaScript','React','Node.js','Databases'], description: 'Build end-to-end web applications used by millions.', path: [{ step:1,label:'HTML & CSS Basics',desc:'Learn structure and styling of web pages.'},{step:2,label:'JavaScript Fundamentals',desc:'Master variables, functions, DOM, and ES6+.'},{step:3,label:'React Frontend',desc:'Build dynamic UIs with React and hooks.'},{step:4,label:'Node.js & Express',desc:'Create REST APIs and server-side logic.'},{step:5,label:'Databases & Deployment',desc:'Use SQL/NoSQL and deploy to cloud platforms.'}]},
    { id: 'devops', title: 'DevOps Engineer', icon: '⚙️', salary: '$90k – $150k', demand: 'High', skills: ['Linux','Docker','Kubernetes','CI/CD','AWS/GCP'], description: 'Automate infrastructure and streamline software delivery.', path: [{step:1,label:'Linux & Scripting',desc:'Master shell scripting and Linux administration.'},{step:2,label:'Version Control',desc:'Git workflows, branching strategies.'},{step:3,label:'Docker & Containers',desc:'Containerise applications with Docker.'},{step:4,label:'Kubernetes',desc:'Orchestrate containers at scale.'},{step:5,label:'Cloud & CI/CD',desc:'Deploy pipelines on AWS/GCP/Azure.'}]},
    { id: 'cybersec', title: 'Cybersecurity Analyst', icon: '🔐', salary: '$80k – $140k', demand: 'Very High', skills: ['Networking','Ethical Hacking','SIEM','Cryptography','Compliance'], description: 'Protect systems and data from cyber threats.', path: [{step:1,label:'Networking Basics',desc:'TCP/IP, DNS, firewalls, and protocols.'},{step:2,label:'Operating Systems',desc:'Linux and Windows security hardening.'},{step:3,label:'Ethical Hacking',desc:'Penetration testing and vulnerability assessment.'},{step:4,label:'SIEM & Monitoring',desc:'Detect and respond to incidents.'},{step:5,label:'Certifications',desc:'CompTIA Security+, CEH, CISSP.'}]},
  ],
  DataScience: [
    { id: 'data-sci', title: 'Data Scientist', icon: '📊', salary: '$90k – $160k', demand: 'Very High', skills: ['Python','Statistics','Machine Learning','SQL','Visualization'], description: 'Extract insights from data and build predictive models.', path: [{step:1,label:'Python & Libraries',desc:'NumPy, Pandas, Matplotlib fundamentals.'},{step:2,label:'Statistics & Math',desc:'Probability, hypothesis testing, linear algebra.'},{step:3,label:'Machine Learning',desc:'Supervised, unsupervised, and ensemble methods.'},{step:4,label:'Deep Learning',desc:'Neural networks with TensorFlow/PyTorch.'},{step:5,label:'End-to-End Projects',desc:'Deploy models and communicate findings.'}]},
    { id: 'data-analyst', title: 'Data Analyst', icon: '📈', salary: '$60k – $100k', demand: 'High', skills: ['SQL','Excel','Power BI','Python','Storytelling'], description: 'Turn raw data into actionable business insights.', path: [{step:1,label:'SQL Mastery',desc:'Queries, joins, aggregations, window functions.'},{step:2,label:'Excel & Spreadsheets',desc:'Pivot tables, VLOOKUP, advanced formulas.'},{step:3,label:'Data Visualisation',desc:'Power BI, Tableau, or Looker dashboards.'},{step:4,label:'Python for Analysis',desc:'Pandas, Seaborn, and Plotly.'},{step:5,label:'Business Storytelling',desc:'Present insights to non-technical stakeholders.'}]},
  ],
  Healthcare: [
    { id: 'doctor', title: 'Medical Doctor', icon: '🩺', salary: '$150k – $300k', demand: 'High', skills: ['Clinical Knowledge','Diagnosis','Patient Care','Ethics','Communication'], description: 'Diagnose and treat patients across all age groups.', path: [{step:1,label:'Pre-Medical Sciences',desc:'Biology, Chemistry, Physics foundations.'},{step:2,label:'Medical School',desc:'MBBS/MD — anatomy, physiology, pathology.'},{step:3,label:'Clinical Rotations',desc:'Hands-on training in hospitals.'},{step:4,label:'Residency',desc:'Specialisation in chosen field.'},{step:5,label:'Board Certification',desc:'Licensing exams and continuing education.'}]},
    { id: 'nurse', title: 'Registered Nurse', icon: '💉', salary: '$60k – $110k', demand: 'Very High', skills: ['Patient Care','Clinical Skills','Medication','Communication','Critical Thinking'], description: 'Provide direct patient care and coordinate treatment plans.', path: [{step:1,label:'Nursing Degree (BSN)',desc:'Bachelor of Science in Nursing.'},{step:2,label:'Clinical Training',desc:'Supervised practice in hospitals/clinics.'},{step:3,label:'NCLEX-RN Exam',desc:'National licensing examination.'},{step:4,label:'Specialisation',desc:'ICU, Paediatrics, Oncology, etc.'},{step:5,label:'Advanced Practice',desc:'NP or CNS for higher responsibility.'}]},
  ],
  Finance: [
    { id: 'fin-analyst', title: 'Financial Analyst', icon: '💰', salary: '$65k – $120k', demand: 'High', skills: ['Financial Modelling','Excel','Valuation','Reporting','CFA'], description: 'Analyse financial data and guide investment decisions.', path: [{step:1,label:'Finance Fundamentals',desc:'Accounting, time value of money, markets.'},{step:2,label:'Excel & Modelling',desc:'DCF, LBO, and three-statement models.'},{step:3,label:'CFA Level 1',desc:'Ethics, quantitative methods, economics.'},{step:4,label:'Industry Experience',desc:'Internships in banking or asset management.'},{step:5,label:'CFA Level 2 & 3',desc:'Advanced valuation and portfolio management.'}]},
    { id: 'inv-banker', title: 'Investment Banker', icon: '��', salary: '$100k – $250k', demand: 'Moderate', skills: ['M&A','Capital Markets','Pitchbooks','Valuation','Networking'], description: 'Advise corporations on mergers, acquisitions, and capital raising.', path: [{step:1,label:'Finance/Economics Degree',desc:'Strong GPA from a target university.'},{step:2,label:'Technical Skills',desc:'Excel, PowerPoint, financial modelling.'},{step:3,label:'Summer Analyst Internship',desc:'Break into a bulge bracket or boutique.'},{step:4,label:'Full-Time Analyst',desc:'2-year programme in M&A or ECM/DCM.'},{step:5,label:'Associate / MBA',desc:'Promote or return post-MBA.'}]},
  ],
  Aptitude: [
    { id: 'placement', title: 'Campus Placement Expert', icon: '🧠', salary: 'Varies by role', demand: 'Always Relevant', skills: ['Quantitative','Logical Reasoning','Verbal','Coding','GD/PI'], description: 'Crack aptitude tests and land your dream campus placement.', path: [{step:1,label:'Quantitative Aptitude',desc:'Number systems, percentages, time & work.'},{step:2,label:'Logical Reasoning',desc:'Puzzles, syllogisms, blood relations.'},{step:3,label:'Verbal Ability',desc:'Reading comprehension, grammar, vocabulary.'},{step:4,label:'Coding Rounds',desc:'DSA basics in Python/Java/C++.'},{step:5,label:'GD & Personal Interview',desc:'Communication, confidence, HR questions.'}]},
    { id: 'gre', title: 'GRE / GMAT Aspirant', icon: '📚', salary: 'Gateway to higher studies', demand: 'High', skills: ['Quant','Verbal','AWA','Time Management','Test Strategy'], description: 'Score high on standardised tests for global university admissions.', path: [{step:1,label:'Diagnostic Test',desc:'Identify strengths and weaknesses.'},{step:2,label:'Quant Preparation',desc:'Arithmetic, algebra, geometry, data.'},{step:3,label:'Verbal Preparation',desc:'RC, CR, SC (GMAT) or Text Completion (GRE).'},{step:4,label:'Full-Length Mocks',desc:'Simulate real exam conditions weekly.'},{step:5,label:'Score & Apply',desc:'Target schools and write strong essays.'}]},
  ],
  Interview: [
    { id: 'tech-int', title: 'Technical Interview Specialist', icon: '💻', salary: 'Unlocks $100k+ roles', demand: 'Always Relevant', skills: ['DSA','System Design','Behavioural','Problem Solving','Communication'], description: 'Ace technical interviews at top product companies.', path: [{step:1,label:'DSA Foundations',desc:'Arrays, strings, linked lists, trees, graphs.'},{step:2,label:'Problem Solving',desc:'LeetCode Easy → Medium → Hard progression.'},{step:3,label:'System Design',desc:'Scalability, databases, caching, APIs.'},{step:4,label:'Behavioural (STAR)',desc:'Structure stories using Situation-Task-Action-Result.'},{step:5,label:'Mock Interviews',desc:'Pramp, Interviewing.io, peer practice.'}]},
    { id: 'hr-int', title: 'HR & Soft Skills Expert', icon: '🎤', salary: 'Unlocks any career', demand: 'Always Relevant', skills: ['Communication','Body Language','Confidence','STAR Method','Research'], description: 'Master behavioural interviews and make a lasting impression.', path: [{step:1,label:'Self-Assessment',desc:'Know your strengths, weaknesses, and story.'},{step:2,label:'Research the Company',desc:'Mission, values, recent news, role details.'},{step:3,label:'STAR Stories',desc:'Prepare 8–10 strong behavioural examples.'},{step:4,label:'Body Language & Voice',desc:'Eye contact, posture, pace, and tone.'},{step:5,label:'Mock Interviews',desc:'Record yourself and get feedback.'}]},
  ],
};

export default function CareerGuidance({ onBack, selectedDomain }) {
  const [activePath, setActivePath] = useState(null);
  const careers = DOMAIN_CAREERS[selectedDomain] || DOMAIN_CAREERS.IT;
  const domainLabel = selectedDomain || 'IT';

  return (
    <motion.div key="career" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
      <div style={{marginBottom:'2rem',textAlign:'center'}}>
        <h1 style={{color:'#fff',fontSize:'2rem',fontWeight:800,margin:'0 0 0.5rem'}}>🎯 Career Guidance</h1>
        <p style={{color:'rgba(255,255,255,0.8)'}}>
          Showing paths for <strong style={{color:'#a7f3d0'}}>{domainLabel}</strong>
          {!selectedDomain && ' — pick a domain on Home for personalised paths'}
        </p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'1.5rem'}}>
        {careers.map((career,i) => (
          <motion.div key={career.id} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            style={{background:'rgba(255,255,255,0.15)',backdropFilter:'blur(20px)',borderRadius:'1.5rem',padding:'2rem',border:'2px solid rgba(255,255,255,0.3)',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',display:'flex',flexDirection:'column',gap:'0.75rem'}}
            whileHover={{y:-6,boxShadow:'0 20px 50px rgba(0,0,0,0.3)'}}>
            <div style={{fontSize:'3rem'}}>{career.icon}</div>
            <h3 style={{color:'#fff',fontSize:'1.4rem',fontWeight:700,margin:0}}>{career.title}</h3>
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              <span style={{padding:'0.35rem 0.75rem',borderRadius:'0.5rem',fontSize:'0.85rem',fontWeight:600,background:'rgba(34,197,94,0.3)',color:'#86efac',border:'1px solid rgba(34,197,94,0.5)'}}>💰 {career.salary}</span>
              <span style={{padding:'0.35rem 0.75rem',borderRadius:'0.5rem',fontSize:'0.85rem',fontWeight:600,background:'rgba(59,130,246,0.3)',color:'#93c5fd',border:'1px solid rgba(59,130,246,0.5)'}}>📈 {career.demand}</span>
            </div>
            <p style={{color:'rgba(255,255,255,0.85)',fontSize:'0.95rem',lineHeight:1.6,margin:0}}>{career.description}</p>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {career.skills.map((sk,j)=><span key={j} style={{padding:'0.3rem 0.65rem',borderRadius:'0.4rem',fontSize:'0.8rem',background:'rgba(255,255,255,0.2)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)'}}>{sk}</span>)}
            </div>
            <motion.button style={{marginTop:'auto',background:'rgba(255,255,255,0.2)',color:'#fff',padding:'0.75rem 1.5rem',borderRadius:'0.75rem',border:'2px solid rgba(255,255,255,0.4)',fontSize:'1rem',fontWeight:700,cursor:'pointer'}}
              whileHover={{background:'rgba(255,255,255,0.35)'}} whileTap={{scale:0.97}}
              onClick={()=>setActivePath(career)}>
              View Career Path →
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activePath && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem',overflowY:'auto'}}
            onClick={e=>e.target===e.currentTarget&&setActivePath(null)}>
            <motion.div initial={{scale:0.85,opacity:0,y:40}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.85,opacity:0,y:40}}
              transition={{type:'spring',stiffness:260,damping:22}}
              style={{background:'linear-gradient(135deg,#0d9488,#0891b2)',borderRadius:'1.5rem',padding:'2rem',width:'100%',maxWidth:'600px',border:'1px solid rgba(255,255,255,0.3)',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',maxHeight:'90vh',overflowY:'auto'}}>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem',gap:'1rem'}}>
                <div>
                  <span style={{fontSize:'2.5rem'}}>{activePath.icon}</span>
                  <h2 style={{color:'#fff',fontSize:'1.6rem',fontWeight:800,margin:'0.25rem 0'}}>{activePath.title}</h2>
                  <p style={{color:'rgba(255,255,255,0.8)',margin:0}}>{activePath.description}</p>
                </div>
                <button onClick={()=>setActivePath(null)} style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',borderRadius:'50%',width:'36px',height:'36px',fontSize:'1rem',cursor:'pointer',flexShrink:0}}>✕</button>
              </div>

              <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
                <span style={{padding:'0.35rem 0.75rem',borderRadius:'0.5rem',fontSize:'0.85rem',fontWeight:600,background:'rgba(34,197,94,0.3)',color:'#86efac',border:'1px solid rgba(34,197,94,0.5)'}}>💰 {activePath.salary}</span>
                <span style={{padding:'0.35rem 0.75rem',borderRadius:'0.5rem',fontSize:'0.85rem',fontWeight:600,background:'rgba(59,130,246,0.3)',color:'#93c5fd',border:'1px solid rgba(59,130,246,0.5)'}}>📈 {activePath.demand}</span>
              </div>

              <h3 style={{color:'#fff',margin:'0 0 1rem',fontSize:'1.1rem'}}>🗺️ Step-by-Step Learning Path</h3>
              <div style={{display:'flex',flexDirection:'column'}}>
                {activePath.path.map((step,idx)=>(
                  <motion.div key={step.step} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:idx*0.08}}
                    style={{display:'flex',alignItems:'flex-start',gap:'1rem',position:'relative',paddingBottom:'1.25rem'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#14b8a6,#22c55e)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'0.95rem',flexShrink:0,zIndex:1}}>{step.step}</div>
                    <div style={{flex:1,paddingTop:'0.25rem'}}>
                      <div style={{color:'#fff',fontWeight:700,fontSize:'1rem',marginBottom:'0.2rem'}}>{step.label}</div>
                      <div style={{color:'rgba(255,255,255,0.75)',fontSize:'0.88rem',lineHeight:1.5}}>{step.desc}</div>
                    </div>
                    {idx<activePath.path.length-1&&<div style={{position:'absolute',left:'17px',top:'36px',width:'2px',height:'calc(100% - 10px)',background:'rgba(255,255,255,0.25)'}}/>}
                  </motion.div>
                ))}
              </div>

              <h3 style={{color:'#fff',margin:'1rem 0 0.75rem',fontSize:'1.1rem'}}>🛠️ Key Skills</h3>
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
                {activePath.skills.map((sk,j)=><span key={j} style={{padding:'0.3rem 0.65rem',borderRadius:'0.4rem',fontSize:'0.8rem',background:'rgba(255,255,255,0.2)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)'}}>{sk}</span>)}
              </div>

              <button onClick={()=>setActivePath(null)} style={{width:'100%',padding:'0.85rem',borderRadius:'0.75rem',border:'2px solid rgba(255,255,255,0.4)',background:'rgba(255,255,255,0.15)',color:'#fff',fontSize:'1rem',fontWeight:700,cursor:'pointer'}}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
