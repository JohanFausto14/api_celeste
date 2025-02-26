const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Importar modelo de usuario
require("dotenv").config();

const verificarToken = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        // Decodificar token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // Buscar al usuario en la base de datos
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Validar la versión del token con la versión actual del usuario
        if (decoded.version !== user.version) {
            return res.status(401).json({ message: "Token inválido o sesión expirada. Inicia sesión nuevamente." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado." });
    }
};

module.exports = verificarToken;
