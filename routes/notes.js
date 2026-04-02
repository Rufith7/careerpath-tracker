const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notes for user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('notes.courseId', 'title')
      .select('notes');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newNote = {
      title,
      content,
      courseId: courseId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.notes.push(newNote);
    await user.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:noteId', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const note = user.notes.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = new Date();

    await user.save();

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:noteId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notes.id(req.params.noteId).remove();
    await user.save();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;