const { Profile, Book, Ledger } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
// const jwt = require("jsonwebtoken");
// const secret = "mysecretssshhhhhhh";
// const expiration = "2h";
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiY2hnZGF2ZUBnbWFpbC5jb20iLCJuYW1lIjoiY2hnZGF2ZSIsIl9pZCI6IjY1OGY0Mjg0MDFjNjI5NWU4ZDZmNDgxZCJ9LCJpYXQiOjE3MDM5ODA1MjAsImV4cCI6MTcwNDA2NjkyMH0.0gDhaCC3Qefe6v3GgXE62xP8CIYt-JoBY4E-06xKvk0";

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
    // get all books that are avaiable to borrow
    booksLending: async () => {
      return Book.find({ isAvailable: true });
    },
    // get one book per bookID
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },

    // queryFavoriteBooks: async (parent, args, context) => {
    //   console.log("finding favorite books");
    //   const favoriteBookIds = parent.favoriteBooks;
    //   const favoriteBooks = await context.db.Book.find({
    //     _id: { $in: favoriteBookIds },
    //   });
    //   return favoriteBooks;
    // },
    queryFavoriteBooks: async (parent, { profileId }, context) => {
      const user = await Profile.findOne({ _id: profileId }).populate(
        "favoriteBooks"
      );
      const favoriteBooks = user.favoriteBooks;
      return favoriteBooks;
    },

    queryMyFavoriteBooks: async (parent, args, context) => {
      const user = await Profile.findOne({ _id: context.user._id }).populate(
        "favoriteBooks"
      );
      const favoriteBooks = user.favoriteBooks;
      return favoriteBooks;
    },

    queryMyLendingBooks: async (parent, args, context) => {
      const user = await Profile.findOne({ _id: context.user._id }).populate(
        "booksToLend"
      );
      const lendingBooks = user.booksToLend;
      return lendingBooks;
    },

    queryMyBorrowedBooks: async (parent, args, context) => {
      const user = await Profile.findOne({ _id: context.user._id }).populate(
        "booksBorrowed"
      );
      const borrowedBooks = user.booksBorrowed;
      return borrowedBooks;
    },

    queryProfileLendingBooks: async (parent, { profileId }, context) => {
      const user = await Profile.findOne({ _id: profileId }).populate(
        "booksToLend"
      );
      const lendingBooks = user.booksToLend;
      return lendingBooks;
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      //   console.log(data);
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
    addBooksToLend: async (parent, { bookId }, context) => {
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
      if (context.user) {
        return Book.create({
          title,
          authors,
          image,
          description,
          googleBookId,
          link,
          owner: context,
          borrower,
          isAvailable,
        });
      }
      throw AuthenticationError;
    },
    // update book borrower
    updateBookBorrower: async (parent, { bookId, profileId }, context) => {
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
      // try {
      //   const { data } = jwt.verify(token, secret, { maxAge: expiration });
      //   context.user = data;
      // } catch {
      //   console.log("Invalid token");
      // }
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
