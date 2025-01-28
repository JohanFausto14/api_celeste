const express = require("express");
const router = express.Router();
const Notificacion = require("../models/notificacion");

// Ruta para obtener las notificaciones filtradas por departamento
router.get("/notificaciones", async (req, res) => {
  try {
    const { department } = req.query;  // Recibimos el departamento desde la query string

    // Verificar que se haya recibido el departamento
    if (!department) {
      return res.status(400).json({ error: "El parámetro 'department' es requerido" });
    }

    // Buscar notificaciones que coincidan con el departamento
    const notificaciones = await Notificacion.find({ departamento: department });

    res.json(notificaciones); // Devolver solo las notificaciones del departamento solicitado
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});

// Ruta para eliminar una notificación
router.delete("/notificaciones/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const notificacion = await Notificacion.findByIdAndDelete(id);

    if (!notificacion) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    res.json({ message: "Notificación eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    res.status(500).json({ error: "Error al eliminar la notificación" });
  }
});

module.exports = router;
