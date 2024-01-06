const { Profile, Book, Ledger } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
// const jwt = require("jsonwebtoken");
// const secret = "mysecretssshhhhhhh";
// const expiration = "2h";
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiZG9taUBnbWFpbC5jb20iLCJuYW1lIjoiRG9taSIsIl9pZCI6IjY1OTMyMGYxNWNhNWMxM2YxNDc1ZDZmMyJ9LCJpYXQiOjE3MDQzNDAxNTgsImV4cCI6MTcwNDQyNjU1OH0.GKBgN2hffzr1B4kJcZCxCIL8kC_hL1NmYDbvyn6EAP0";

const resolvers = {
  Query: {
    // get all profiles
    profiles: async () => {
      return Profile.find();
    },
    // get one profile per profileID
    profile: async (parent, { profileId }) => {
      return Profile.findOne({ _id: profileId }).populate([
        "favoriteBooks",
        "booksToLend",
        "booksLent",
        "booksBorrowed",
      ]);
    },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id }).populate([
          "favoriteBooks",
          "booksToLend",
          "booksLent",
          "booksBorrowed",
        ]);
      }
      throw AuthenticationError;
    },
    // get all books that are avaiable to borrow
    booksLending: async (parent, args, context) => {
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
      if (context.user) {
        return Book.find({
          isAvailable: true,
          owner: { $ne: context.user._id },
        }).populate("owner");
      }
      throw AuthenticationError;
    },
    // get one book per bookID
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    //all books
    books: async (parent, args) => {
      return Book.find();
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
    favoriteBook: async (parent, { book }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { favoriteBooks: book },
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
      console.log("add Friend");
      if (context.user) {
        const user = Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { friends: profileId },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        const friend = Profile.findOneAndUpdate(
          { _id: profileId },
          {
            $addToSet: { friends: context.user._id },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return [user, friend];
      }
      throw AuthenticationError;
    },
    // remove a friend
    removeFriend: async (parent, { profileId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { friends: profileId } },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    // add a book to books to lend
    addBooksToLend: async (parent, { book }, context) => {
      if (context.user) {
        // first create book record based on google API data
        const newBook = await Book.create({
          ...book,
          isAvailable: true,
          owner: context.user._id,
        });
        // then add book to user's lending list
        const profile = await Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { booksToLend: newBook._id },
          },
          { new: true, runValidators: true }
        );
        return profile;
      }
      throw AuthenticationError;
    },
    // remove a book from books to lend
    removeBooksToLend: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { booksToLend: bookId } },
          {
            new: true,
            runValidators: true,
          }
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
          { $pull: { booksLent: bookId } },
          {
            new: true,
            runValidators: true,
          }
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
          { $pull: { booksBorrowed: bookId } },
          {
            new: true,
            runValidators: true,
          }
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
    // update profile image
    addProfileImage: async (parent, { image }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            profileImage: image,
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
    addBook: async (parent, { book }, context) => {
      if (context.user) {
        const newBook = await Book.create({
          ...book,
        });
        console.log("new Book: ", newBook)
        // then grab book _id and use profile.findOneAndUpdate to add to favorites list
        const profile = await Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { favoriteBooks: newBook._id } },
          { new: true, runValidators: true }
        );
        return profile;
      }
      throw AuthenticationError;
    },

    // update book borrower
    updateBookBorrower: async (parent, { bookId, profileId }, context) => {
      if (context.user) {
        return Book.findOneAndUpdate(
          { _id: bookId },
          {
            borrower: profileId,
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
          { $set: { isAvailable: !book.isAvailable } },
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
      { bookId, lender, borrower, status },
      context
    ) => {
      if (context.user) {
        return Ledger.create({
          bookId,
          lender,
          borrower,
          lendDate: Date.now(),
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
              status: !ledger.status,
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
