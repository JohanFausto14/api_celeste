require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Importar CORS
const connectDB = require("./db");
const multas = require("./src/routes/multas");

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json());

// Rutas
app.use("/api", multas);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
