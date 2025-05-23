// routes/registros.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los registros
router.get('/', (req, res) => {
  db.query('SELECT * FROM registros', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un nuevo registro
router.post('/', (req, res) => {
  const { fecha, litros } = req.body;
  if (!fecha || !litros) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.query('INSERT INTO registros (fecha, litros) VALUES (?, ?)', [fecha, litros], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Registro guardado correctamente' });
  });
});

module.exports = router;
