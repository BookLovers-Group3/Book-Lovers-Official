const { Profile, Book, Ledger } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

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
    booksLending: async (parent, args, context) => {
      if (context.user) {
        return Book.find({
          isAvailable: true,
          owner: { $ne: context.user._id },
        });
      }
      throw AuthenticationError;
    },
    // get one book per bookID
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },

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
      console.log("book from front: ", book);
      if (context.user) {
        return Book.create({
          ...book,
          // then grab book _id and use profile.findOneAndUpdate to add to favorites list
        });
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
