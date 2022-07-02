const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  book_image: {
    type: String,
  },
  isbn: {
    type: String,
    // required: true,
  },
  author: {
    type: String,
    // required: true,
  },
  published_date: {
    type: String,
  },
  publisher: {
    type: String,
  },
  updated_date: {
    type: String,
    default: Date.now(),
  },
});

const Book = new mongoose.model("Book", bookSchema);

module.exports = Book;
