const { Profile, Book } = require("../models");
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

    addFavBook: async (parent, { bookId }, context) => {
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

    removeFavBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { favoriteBooks: bookId } }
        );
      }
      throw AuthenticationError;
    },

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

    removeFriend: async (parent, { profileId }, context) => {
      if (context.user) {
        return Profile.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { friends: profileId } }
        );
      }
      throw AuthenticationError;
    },

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

    removeBooksToLend: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { booksToLend: bookId } }
        );
      }
      throw AuthenticationError;
    },

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

    removeBooksLent: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { booksLent: bookId } }
        );
      }
      throw AuthenticationError;
    },

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

    removeFromBooksBorrowed: async (parent, { bookId }, context) => {
      if (context.user) {
        return Profile.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { booksBorrowed: bookId } }
        );
      }
      throw AuthenticationError;
    },

    updateStatus: async (parent, { newStatus }, context) => {
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

    // Add a third argument to the resolver to access data in our `context`

    // Set up mutation so a logged in user can only remove their profile and no one else's
    removeProfile: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
