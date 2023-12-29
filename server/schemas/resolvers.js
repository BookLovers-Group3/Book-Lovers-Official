const { Profile, Book, Ledger } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const secret = "mysecretssshhhhhhh";
const expiration = "2h";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiY2hnZGF2ZUBnbWFpbC5jb20iLCJuYW1lIjoiY2hnZGF2ZSIsIl9pZCI6IjY1OGY0Mjg0MDFjNjI5NWU4ZDZmNDgxZCJ9LCJpYXQiOjE3MDM4ODc0OTIsImV4cCI6MTcwMzk3Mzg5Mn0.WrvFmWaMjQy3d5Gj3vB0sdS4_3wBHuFA0TbR06Vj3-0";

const resolvers = {
  Query: {
    // get all profiles
    profiles: async () => {
      return Profile.find();
    },
    // get one profile per profileID
    profile: async (parent, { profileId }) => {
      return Profile.findOne({ _id: profileId });
    },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    // get all books
    books: async () => {
      return Book.find();
    },
    // get one book per bookID
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
  },

  Mutation: {
    // create a profile
    addProfile: async (parent, { name, email, password, gender, status }) => {
      const profile = await Profile.create({
        name,
        email,
        password,
        gender,
        status,
      });
      const token = signToken(profile);

      return { token, profile };
    },
    // login
    login: async (parent, { email, password }) => {
      const profile = await Profile.findOne({ email });

      if (!profile) {
        throw AuthenticationError;
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(profile);
      return { token, profile };
    },
    // add a favorite book
    addFavBook: async (parent, { bookId }, context) => {
      try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        context.user = data;
        console.log(data);
      } catch {
        console.log("Invalid token");
      }
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { favoriteBooks: bookId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    //  remove a favorite book
    removeFavBook: async (parent, { bookId }, context) => {
      try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        context.user = data;
      } catch {
        console.log("Invalid token");
      }
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { favoriteBooks: bookId } },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // add a friend
    addFriend: async (parent, { profileId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { friends: profileId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // remove a friend
    removeFriend: async (parent, { profileId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { friends: profileId } }
        );
      }
      throw AuthenticationError;
    },
    // add a book to books to lend
    addBooksToLend: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { booksToLend: bookId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // remove a book from books to lend
    removeBooksToLend: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { booksToLend: bookId } }
        );
      }
      throw AuthenticationError;
    },
    // add a book to books lent
    addBooksLent: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { booksLent: bookId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // remove a book from books lent
    removeBooksLent: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { booksLent: bookId } }
        );
      }
      throw AuthenticationError;
    },
    // add a book to books borrowed
    addBooksBorrowed: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { booksBorrowed: bookId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // remove a book from books borrowed
    removeBooksBorrowed: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { booksBorrowed: bookId } }
        );
      }
      throw AuthenticationError;
    },
    // update the user status
    updateProfileStatus: async (parent, { newStatus }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            status: newStatus,
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // Set up mutation so a logged in user can only remove their profile and no one else's
    removeProfile: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    // create a book
    addBook: async (
      parent,
      {
        title,
        authors,
        image,
        description,
        googleBookId,
        link,
        owner,
        borrower,
        isAvailable,
      },
      context
    ) => {
      if (context.user) {
        return Book.create({
          title,
          authors,
          image,
          description,
          googleBookId,
          link,
          owner,
          borrower,
          isAvailable,
        });
      }
      throw AuthenticationError;
    },
    // update book borrower
    updateBookBorrower: async (parent, { bookId, profildId }, context) => {
      if (context.user) {
        return Book.findOneAndUpdate(
          { _id: bookId },
          {
            borrower: profildId,
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // update book availability
    updateBookAvailability: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findById(bookId);

        if (!book) {
          throw new Error("Book not found");
        }
        const updatedBook = Book.findOneAndUpdate(
          { _id: bookId },
          { $set: { isAvailable: { $not: book.isAvailable } } },
          {
            new: true,
            runValidators: true,
          }
        );
        return updatedBook;
      }
      throw AuthenticationError;
    },
    // create a ledger
    openLedger: async (
      parent,
      { bookId, lender, borrower, lendDate, returnDate, status },
      context
    ) => {
      if (context.user) {
        return Ledger.create({
          bookId,
          lender,
          borrower,
          lendDate,
          returnDate,
          status,
        });
      }
      throw AuthenticationError;
    },
    // update a ledger return date
    closeLedger: async (parent, { ledgerId }, context) => {
      if (context.user) {
        const ledger = await Ledger.findById(ledgerId);

        if (!ledger) {
          throw new Error("Ledger not found");
        }
        const updatedLedger = Ledger.findOneAndUpdate(
          { _id: ledgerId },
          {
            $set: {
              returnDate: Date.now(),
              status: { $not: ledger.status },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        return updatedLedger;
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
