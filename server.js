require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const multas = require("./src/routes/multas");
const usuarios = require("./src/routes/usuarios");
const notificaciones = require("./src/routes/notificaciones");

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", usuarios);
app.use("/api", multas);
app.use("/api", notificaciones); // Nueva ruta de notificaciones

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
