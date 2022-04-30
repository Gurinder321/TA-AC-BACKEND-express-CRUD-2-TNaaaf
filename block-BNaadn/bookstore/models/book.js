const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: String,
    pages: Number,
    publication: String,
    cover_image: String,
    category: [String],
    author: {
      name: String,
      email: String,
      country: String,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
