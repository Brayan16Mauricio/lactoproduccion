const express = require('express');
const router = express.Router();
const db = require('../db');

// Login de usuario
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({ message: 'Login exitoso' });
  });
});

module.exports = router;
