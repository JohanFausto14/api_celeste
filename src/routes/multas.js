const express = require("express");
const router = express.Router();
const Multa = require("../models/multa");
const Notificacion = require("../models/notificacion");

// Ruta para insertar una nueva multa
router.post("/insertar_multas", async (req, res) => {
  try {
    const { usuario, nombreCompleto, departamento, torre, multa, descripcion, fecha } = req.body;

    // Validar campos obligatorios
    if (!usuario || !nombreCompleto || !departamento || !torre || !multa || !descripcion || !fecha) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar que el departamento no sea 1 (administrador)
    if (departamento === "1") {
      return res.status(400).json({ message: "No se puede multar al departamento 1 (administrador)" });
    }

    // Crear y guardar la multa
    const nuevaMulta = new Multa({ usuario, nombreCompleto, departamento, torre, multa, descripcion, fecha });
    await nuevaMulta.save();

    // Crear y guardar la notificación
    const nuevaNotificacion = new Notificacion({
      usuario,
      departamento,
      multa,
      descripcion,
      fecha: new Date(fecha), // Asegurar que la fecha esté en formato Date
    });
    await nuevaNotificacion.save();

    res.status(201).json({ message: "Multa registrada exitosamente", multa: nuevaMulta });
  } catch (error) {
    console.error("Error en /insertar_multas:", error);
    res.status(500).json({ message: "Error al registrar la multa" });
  }
});

// Ruta para obtener todas las multas
router.get("/obtener_multas", async (req, res) => {
  try {
    const multas = await Multa.find();

    const formattedMultas = multas.map((multa) => ({
      id: multa._id,
      usuario: multa.usuario,
      nombreCompleto: multa.nombreCompleto,
      departamento: multa.departamento,
      torre: multa.torre,
      multa: multa.multa,
      descripcion: multa.descripcion,
      fecha: new Date(multa.fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    res.json(formattedMultas);
  } catch (error) {
    console.error("Error al obtener las multas:", error);
    res.status(500).json({ error: "Error al obtener las multas" });
  }
});

module.exports = router;