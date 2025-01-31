const mongoose = require("mongoose");

const NotificacionSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  departamento: { type: String, required: true },
  multa: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notificacion", NotificacionSchema);