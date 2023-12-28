const { Schema } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `favoriteBooks` array in Profile.js
const googleBookSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = googleBookSchema;
