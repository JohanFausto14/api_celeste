const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  permanentToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // El documento expirará después de 1 hora (3600 segundos)
  },
});

// Crear un índice TTL en el campo `createdAt`
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('Token', tokenSchema);