const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  rentPrice: { type: Number, required: true },
  issueCount: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  language: { type: String, required: true }
});

module.exports = mongoose.model('Book', bookSchema);

// {
//     "ISBN": "78787",
//     "name": "Animal Farm",
//     "rentPrice": 30,
//     "language": "French"
// }