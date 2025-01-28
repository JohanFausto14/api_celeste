const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ruta hacia el modelo de usuario

// Obtener usuarios
router.get('/obtener_usuarios', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Insertar usuario
router.post('/insertar_usuario', async (req, res) => {
  const { name, phone, department, tower, role } = req.body;
  try {
    // Validar datos
    if (!name || !phone || !department || !tower || !role) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Crear nuevo usuario
    const newUser = new User({
      name,
      phone,
      department,
      tower,
      role, // Cambié 'profile' por 'role' para hacerlo consistente con el segundo archivo
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: savedUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
});

// Log in: Buscar usuario por teléfono y verificar rol
router.post('/login', async (req, res) => {
  const { phone } = req.body;

  try {
    // Validar si el teléfono fue proporcionado
    if (!phone) {
      return res.status(400).json({ message: 'El número de teléfono es obligatorio.' });
    }

    // Buscar al usuario por su número de teléfono
    const user = await User.findOne({ phone });

    // Si no se encuentra el usuario
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar si el rol del usuario es "Administrador"
    if (user.role === 'Administrador') {
      return res.status(200).json({
        message: 'Usuario autenticado',
        redirectTo: '/admin', // Redirigir al administrador
        userData: {
          name: user.name,
          role: user.role,
          department: user.department,
          tower: user.tower
        }
      });
    }

    // Si el rol no es Administrador
    return res.status(200).json({
      message: 'Usuario autenticado',
      userData: {
        name: user.name,
        role: user.role,
        department: user.department,
        tower: user.tower
      }
    });

  } catch (error) {
    console.error('Error al intentar loguearse:', error);
    res.status(500).json({ message: 'Error al intentar loguearse.', error });
  }
});

// Nueva ruta para verificar teléfono y verificar si el rol es 'Administrador'
router.post('/verificarTelefono', async (req, res) => {
  const { phone } = req.body;

  try {
    // Validar si el teléfono fue proporcionado
    if (!phone) {
      return res.status(400).json({ message: 'El número de teléfono es obligatorio.' });
    }

    // Buscar al usuario por su número de teléfono
    const user = await User.findOne({ phone });

    // Si no se encuentra el usuario
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar si el rol del usuario es 'Administrador'
    if (user.role === 'Administrador') {
      return res.status(200).json({
        message: 'Usuario es Administrador',
        userData: {
          name: user.name,
          role: user.role,
          department: user.department,
          tower: user.tower
        }
      });
    }

    // Si el rol no es 'Administrador', solo devuelve los datos del usuario
    return res.status(200).json({
      message: 'Usuario autenticado, pero no es Administrador',
      userData: {
        name: user.name,
        role: user.role,
        department: user.department,
        tower: user.tower
      }
    });

  } catch (error) {
    console.error('Error al verificar el teléfono:', error);
    res.status(500).json({ message: 'Error al verificar el teléfono.', error });
  }
});

module.exports = router;
