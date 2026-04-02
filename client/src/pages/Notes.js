import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DOMAIN_COLORS = {
  IT:          'linear-gradient(135deg,#0d9488,#14b8a6)',
  DataScience: 'linear-gradient(135deg,#06b6d4,#0284c7)',
  Healthcare:  'linear-gradient(135deg,#10b981,#059669)',
  Finance:     'linear-gradient(135deg,#22c55e,#16a34a)',
  Aptitude:    'linear-gradient(135deg,#14b8a6,#06b6d4)',
  Interview:   'linear-gradient(135deg,#0891b2,#0e7490)',
  General:     'linear-gradient(135deg,#8b5cf6,#6d28d9)',
};

const STORAGE_KEY = 'careerpath_notes';

const loadNotes = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

const saveNotes = (notes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export default function Notes({ onBack, selectedDomain }) {
  const [notes, setNotes]           = useState(loadNotes);
  const [filterDomain, setFilter]   = useState('All');
  const [showForm, setShowForm]     = useState(false);
  const [editNote, setEditNote]     = useState(null);
  const [title, setTitle]           = useState('');
  const [content, setContent]       = useState('');
  const [domain, setDomain]         = useState(selectedDomain || 'General');
  const [search, setSearch]         = useState('');

  useEffect(() => { saveNotes(notes); }, [notes]);

  const domains = ['General', 'IT', 'DataScience', 'Healthcare', 'Finance', 'Aptitude', 'Interview'];

  const openNew = () => {
    setEditNote(null);
    setTitle('');
    setContent('');
    setDomain(selectedDomain || 'General');
    setShowForm(true);
  };

  const openEdit = (note) => {
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
    setDomain(note.domain);
    setShowForm(true);
  };

  const saveNote = () => {
    if (!title.trim() || !content.trim()) return;
    if (editNote) {
      setNotes(prev => prev.map(n => n.id === editNote.id
        ? { ...n, title, content, domain, updatedAt: new Date().toISOString() }
        : n
      ));
    } else {
      setNotes(prev => [{
        id: Date.now().toString(),
        title, content, domain,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, ...prev]);
    }
    setShowForm(false);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notes.filter(n => {
    const matchDomain = filterDomain === 'All' || n.domain === filterDomain;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                        n.content.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      key="notes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh' }}
    >
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.h1}>📝 My Notes</h1>
          <p style={S.sub}>Capture ideas, summaries, and key learnings</p>
        </div>
        <button style={S.addBtn} onClick={openNew}>+ New Note</button>
      </div>

      {/* Search + Filter */}
      <div style={S.toolbar}>
        <input
          style={S.search}
          placeholder="🔍 Search notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={S.filters}>
          {['All', ...domains].map(d => (
            <button
              key={d}
              style={{ ...S.filterBtn, ...(filterDomain === d ? S.filterActive : {}) }}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            {notes.length === 0 ? 'No notes yet. Click "+ New Note" to get started!' : 'No notes match your search.'}
          </p>
        </div>
      ) : (
        <div style={S.grid}>
          <AnimatePresence>
            {filtered.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                style={S.card}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}
              >
                {/* Domain badge */}
                <div style={{ ...S.domainBadge, background: DOMAIN_COLORS[note.domain] || DOMAIN_COLORS.General }}>
                  {note.domain}
                </div>
                <h3 style={S.noteTitle}>{note.title}</h3>
                <p style={S.noteContent}>{note.content}</p>
                <div style={S.noteMeta}>
                  <span style={S.date}>{fmt(note.updatedAt)}</span>
                  <div style={S.actions}>
                    <button style={S.editBtn} onClick={() => openEdit(note)}>✏️ Edit</button>
                    <button style={S.delBtn}  onClick={() => deleteNote(note.id)}>🗑️</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Note Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={S.overlay}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              style={S.modal}
            >
              <h2 style={S.modalTitle}>{editNote ? '✏️ Edit Note' : '📝 New Note'}</h2>

              <label style={S.label}>Title</label>
              <input
                style={S.input}
                placeholder="Note title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />

              <label style={S.label}>Domain</label>
              <select style={S.input} value={domain} onChange={e => setDomain(e.target.value)}>
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <label style={S.label}>Content</label>
              <textarea
                style={{ ...S.input, minHeight: '140px', resize: 'vertical' }}
                placeholder="Write your note here…"
                value={content}
                onChange={e => setContent(e.target.value)}
              />

              <div style={S.modalBtns}>
                <button style={S.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button
                  style={{ ...S.saveBtn, opacity: (!title.trim() || !content.trim()) ? 0.5 : 1 }}
                  onClick={saveNote}
                  disabled={!title.trim() || !content.trim()}
                >
                  {editNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const S = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  h1:     { color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0 },
  sub:    { color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem' },
  addBtn: { background: 'linear-gradient(135deg,#14b8a6,#22c55e)', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  toolbar: { marginBottom: '1.5rem' },
  search: { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 0.9rem', borderRadius: '50px', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  filterActive: { background: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.6)' },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' },
  card:  { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  domainBadge: { display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '50px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, alignSelf: 'flex-start' },
  noteTitle:   { color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  noteContent: { color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  noteMeta:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  date:        { color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' },
  actions:     { display: 'flex', gap: '0.5rem' },
  editBtn:     { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' },
  delBtn:      { background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' },
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: 'linear-gradient(135deg,#0d9488,#0891b2)', borderRadius: '1.5rem', padding: '2rem', width: '100%', maxWidth: '520px', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' },
  modalTitle:  { color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' },
  label:       { display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.35rem', marginTop: '1rem', fontSize: '0.9rem' },
  input:       { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  modalBtns:   { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  cancelBtn:   { flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  saveBtn:     { flex: 2, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: 'linear-gradient(135deg,#14b8a6,#22c55e)', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
};
