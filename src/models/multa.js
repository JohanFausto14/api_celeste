const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  nombreCompleto: { type: String, required: true },
  departamento: { type: String, required: true },
  torre: { type: String, required: true },
  multa: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
});

const Multa = mongoose.model('Multa', multaSchema);

module.exports = Multa;
