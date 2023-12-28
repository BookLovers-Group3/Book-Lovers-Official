const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  genre: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  borrower: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  isAvailable: {
    type: Boolean,
  },
});

const Book = model("Book", bookSchema);

module.exports = Book;
