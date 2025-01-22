const mongoose = require('mongoose');

const MultaSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    nombreCompleto: { type: String, required: true },
    departamento: { type: String, required: true },
    torre: { type: String, required: true },
    multa: { type: String, required: true },
}, {
    timestamps: true, // Opcional: agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Multa', MultaSchema);