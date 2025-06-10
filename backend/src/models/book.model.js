const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  condition: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  availability: { type: String, enum: ['available', 'on-loan'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
