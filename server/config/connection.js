const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_CONNECT_URI || "mongodb://127.0.0.1:27017/book-lovers";

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

module.exports = mongoose.connection;

