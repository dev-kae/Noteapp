const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (users.length > 0) {
    const user = users[0];
    if (password === user.password) {
      const userData = {
        id: user.id,
        email: user.email
      };
      res.json(userData);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ message: 'User not found' });
  }
});


module.exports = router;