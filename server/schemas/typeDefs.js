const typeDefs = `
  scalar Date

  type Profile {
    _id: ID
    name: String
    email: String
    password: String
    friends: [Profile!]
    favoriteBooks: [Book!]
    booksToLend: [Book!]
    booksLent: [Book!]
    booksBorrowed: [Book!]
    gender: String!
    status: String!
    lookingFor: [String!]
    favoriteGenres: [String!]
    profileImage: String
  }

  type Book {
    _id: ID!
    googleBookId: String
    title: String!
    authors: [String]
    image: String
    description: String
    link: String
    owner: Profile
    borrower: Profile
    isAvailable: Boolean!
  }

  type Ledger {
    _id: ID
    bookId: ID!
    lender: ID!
    borrower: ID!
    lendDate: Date
    returnDate: Date
    status: Boolean
  }

  input BookInput {
    title: String!
    authors: [String]
    description: String
    googleBookId: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type UserBookCount {
    count: Int
  }

  type Query {
    books: [Book]
    profiles: [Profile!]
    ledgers: [Ledger]
    profile(profileId: ID!): Profile
    booksLending:[Book!]
    book(bookId: ID!): Book
    me: Profile
    getUserBookCount(profileId: ID!): UserBookCount
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!, gender: String!, status: String!, favoriteGenres: [String!], lookingFor: [String!]): Auth

    login(email: String!, password: String!): Auth

    favoriteBook(book: BookInput!): Profile

    removeFavBook(bookId: ID!): Profile

    addFriend(profileId: ID!): Profile

    removeFriend(profileId: ID!): Profile

    addBooksToLend(book: BookInput!): Profile

    removeBooksToLend(bookId: ID!): Profile

    addBooksLent(bookId: ID!): Profile

    removeBooksLent(bookId: ID!): Profile

    addBooksBorrowed(bookId: ID!): Profile

    removeBooksBorrowed(bookId: ID!): Profile

    updateProfileStatus(newStatus: String!): Profile

    addProfileImage(image: String!): Profile
    
    removeProfile: Profile

    addFavBook(book: BookInput!): Profile

    updateBookBorrower(bookId: ID!, profileId: ID!): Book

    updateBookAvailability(bookId: ID!): Book

    openLedger(bookId: ID!, lender: ID!, borrower: ID!): Ledger

    closeLedger(bookId: ID!): Ledger
  }
`;

module.exports = typeDefs;
