const express = require('express');
const router = express.Router();
const Multa = require('../models/multa'); // Ajusta la ruta al modelo según tu estructura

// Insertar multas
router.post('/insertar_multas', async (req, res) => {
    try {
        const { usuario, nombreCompleto, departamento, torre, multa } = req.body;

        // Validar datos
        if (!usuario || !nombreCompleto || !departamento || !torre || !multa) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear nueva multa
        const nuevaMulta = new Multa({ usuario, nombreCompleto, departamento, torre, multa });
        await nuevaMulta.save();

        res.status(201).json({ message: 'Multa registrada exitosamente', multa: nuevaMulta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar la multa' });
    }
});

router.get('/obtener_multas', async (req, res) => {
    try {
      const multas = await Multa.find();
  
      const formattedMultas = multas.map((multa) => ({
        id: multa._id, // ID del documento en MongoDB
        usuario: multa.usuario,
        nombreCompleto: multa.nombreCompleto,
        departamento: multa.departamento,
        torre: multa.torre,
        multa: multa.multa,
      }));
  
      res.json(formattedMultas);
    } catch (error) {
      console.error('Error al obtener las multas:', error);
      res.status(500).json({ error: 'Error al obtener las multas' });
    }
  });

module.exports = router;