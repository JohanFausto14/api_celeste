require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Importar CORS
const connectDB = require("./db");
const multas = require("./src/routes/multas");
const user = require("./src/routes/usuarios");
const notificaciones = require("./src/routes/notificaciones");
const login = require("./src/routes/login");
const verificarToken = require("./src/middleware/authenticate");

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json());


app.use((req, res, next) => {
    const origin = req.headers.origin || req.headers.host; // Obtener el origen o el host
    if (origin === "http://localhost:5000" || origin === "localhost:5000") {
        next(); // Permitir la solicitud
    } else {
        res.status(403).json({ error: 'Acceso no permitido' }); // Denegar la solicitud
    }
});


app.use("/api", login);

// Rutas que requieren autenticación
app.use("/api", verificarToken, multas);
app.use("/api", verificarToken, user);
app.use("/api", verificarToken, notificaciones);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));