const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/caja_fuerte_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error(err));

// Modelo de datos
const attemptSchema = new mongoose.Schema({
  name: String,
  rfidId: String,
  money: String,
  timestamp: { type: Date, default: Date.now }
});
const Attempt = mongoose.model('Attempt', attemptSchema);

// Endpoint para recibir intentos
app.post('/api/attempts', async (req, res) => {
  try {
    const { name, rfidId, money } = req.body;
    const newAttempt = new Attempt({ name, rfidId, money });
    await newAttempt.save();
    res.status(201).json({ message: 'Intento guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el intento' });
  }
});

// Endpoint para obtener el historial
app.get('/api/attempts', async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ timestamp: -1 });
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los intentos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
