const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  tower: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true }, // Nuevo campo para la contraseña
});

// Hash de la contraseña antes de guardar el usuario
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (!this.password.startsWith('$2a$')) { // Evita doble hash
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  next();
});


// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;