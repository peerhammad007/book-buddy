const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending'
  },
  dates: {
    requestDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    returnDate: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
