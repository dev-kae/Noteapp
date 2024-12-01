const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [notes] = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
  res.json(notes);
});

router.get('/:id', async (req, res) => {
  try {
    const [notes] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    console.log('Note retrieved:', notes[0]);
    if (notes && notes.length > 0) {
      res.json(notes[0]);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching note' });
  }
});


router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const [result] = await db.query(
    'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, 1]
  );
  
  const [newNote] = await db.query(
    'SELECT * FROM notes WHERE id = ?',
    [result.insertId]
  );
  try {
    const [existingNotes] = await db.query('SELECT * FROM notes WHERE title = ?', [title]);
    
    if (existingNotes.length > 0) {
      return res.status(409).json({ message: 'Já existe uma nota com este nome' });
    }
    
    const [result] = await db.query(
      'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, 1]
    );
    
    const [newNote] = await db.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    res.status(201).json(newNote[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
  res.status(201).json(newNote[0]);
});

router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  await db.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content, req.params.id]
  );
  
  const [updatedNote] = await db.query(
    'SELECT * FROM notes WHERE id = ?',
    [req.params.id]
  );
  
  res.json(updatedNote[0]);
});

router.delete('/:ids', async (req, res) => {
  const ids = req.params.ids.split(',');
  await db.query('DELETE FROM notes WHERE id IN (?)', [ids]);
  res.json({ success: true });
});

module.exports = router;
