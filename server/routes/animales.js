const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los animales
router.get('/', (req, res) => {
  db.query('SELECT * FROM animales', (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Crear nuevo animal
router.post('/', (req, res) => {
  const { id, edad, raza, ultimo_servicio, foto } = req.body;
  db.query(
    'INSERT INTO animales (id, edad, raza, ultimo_servicio, foto) VALUES (?, ?, ?, ?, ?)',
    [id, edad, raza, ultimo_servicio, foto],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    }
  );
});

// Actualizar animal
router.put('/:id', (req, res) => {
  const { edad, raza, ultimo_servicio, foto } = req.body;
  db.query(
    'UPDATE animales SET edad=?, raza=?, ultimo_servicio=?, foto=? WHERE id=?',
    [edad, raza, ultimo_servicio, foto, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

// Eliminar animal
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM animales WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;
