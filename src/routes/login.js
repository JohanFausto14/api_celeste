const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ruta hacia el modelo de usuario
const bcrypt = require('bcryptjs');

// Autenticar usuario con teléfono y contraseña
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
  
    try {
      // Validar si el teléfono y la contraseña fueron proporcionados
      if (!phone || !password) {
        return res.status(400).json({ message: 'El número de teléfono y la contraseña son obligatorios.' });
      }
  
      // Buscar al usuario por su número de teléfono
      const user = await User.findOne({ phone });
  
      // Si no se encuentra el usuario
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      // Verificar la contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }
  
      // Generar el token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // El token expira en 1 hora
      );
  
      // Si el usuario es autenticado correctamente
      return res.status(200).json({
        message: 'Usuario autenticado',
        token, // Envía el token al cliente
        userData: {
          name: user.name,
          role: user.role,
          department: user.department,
          tower: user.tower,
        },
      });
    } catch (error) {
      console.error('Error al intentar loguearse:', error);
      res.status(500).json({ message: 'Error al intentar loguearse.', error });
    }
  });




module.exports = router;