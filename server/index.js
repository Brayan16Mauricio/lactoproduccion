
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = require('./db');

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas de animales
const animalesRoutes = require('./routes/animales');
app.use('/api/animales', animalesRoutes);

// Rutas de producción de leche
const produccionRoutes = require('./routes/registros');
app.use('/api/registros', produccionRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});