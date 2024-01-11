const { Schema, model } = require("mongoose");
const Book = require("./Book");
const bcrypt = require("bcrypt");

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  favoriteBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  booksToLend: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  booksLent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  booksBorrowed: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  gender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  lookingFor: [
    {
      type: String,
    },
  ],
  favoriteGenres: [
    {
      type: String,
    },
  ],
  profileImage: {
    type: String,
  },
});

// set up pre-save middleware to create password
profileSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
profileSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Profile = model("Profile", profileSchema);

module.exports = Profile;
