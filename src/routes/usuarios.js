const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importar el modelo de usuario
const Token = require('../models/Token'); // Importar el modelo de Token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




router.get('/verificar/:departamento', async (req, res) => {
  const { departamento } = req.params;

  try {
    // Buscar los usuarios que pertenecen al departamento
    const usuarios = await User.find({ department: departamento }).select('_id');
    const userIds = usuarios.map(user => user._id);

    if (userIds.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios en este departamento' });
    }

    // Buscar tokens asociados a esos usuarios
    const tokens = await Token.find({ userId: { $in: userIds } });

    if (tokens.length === 0) {
      return res.status(404).json({ message: 'No hay tokens asociados a este departamento' });
    }

    res.json({ message: 'Tokens encontrados', tokens });

  } catch (error) {
    console.error('Error al verificar los tokens:', error);
    res.status(500).json({ message: 'Error al verificar los tokens', error });
  }
});


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
  const { name, phone, department, tower, role, password } = req.body;
  try {
    // Validar datos
    if (!name || !phone || !department || !tower || !role || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Crear nuevo usuario
    const newUser = new User({
      name,
      phone,
      department,
      tower,
      role,
      password, // Incluir la contraseña
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: savedUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
});

// Ruta para obtener los datos de un departamento
router.get('/obtener_datos_departamento', async (req, res) => {
  try {
    const { departamento } = req.query;

    if (!departamento) {
      return res.status(400).json({ error: "El parámetro 'departamento' es requerido" });
    }

    // Buscar el usuario asociado al departamento
    const usuario = await User.findOne({ department: departamento });

    if (!usuario) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }

    // Devolver los datos del departamento
    res.json({
      departamento: usuario.department,
      usuario: usuario.phone, // O el campo que identifique al usuario
      nombreCompleto: usuario.name,
      torre: usuario.tower,
    });
  } catch (error) {
    console.error("Error al obtener los datos del departamento:", error);
    res.status(500).json({ error: "Error al obtener los datos del departamento" });
  }
});

// Ruta para cambiar la contraseña
router.post('/cambiar-contrasena', async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "La nueva contraseña es requerida." });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Incrementar la versión del usuario
    user.password = hashedPassword;
    user.version += 1; 
    await user.save();

    // Eliminar tokens en la base de datos
    await Token.deleteMany({ userId });

    res.status(200).json({ message: "Contraseña cambiada exitosamente. Se cerrará sesión en todos los dispositivos." });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    res.status(500).json({ message: "Error al cambiar la contraseña." });
  }
});



// Ruta para eliminar el token permanente
router.post('/eliminar-token-permanente', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado

  try {
    // Verificar el token y obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Eliminar el token permanente asociado al usuario
    await Token.deleteMany({ userId });

    res.status(200).json({ message: "Token permanente eliminado." });
  } catch (error) {
    console.error("Error al eliminar el token permanente:", error);
    res.status(500).json({ message: "Error al eliminar el token permanente." });
  }
});

module.exports = router;