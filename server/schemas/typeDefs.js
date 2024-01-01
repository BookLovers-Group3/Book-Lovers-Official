const typeDefs = `
  scalar Date

  type Profile {
    _id: ID
    name: String
    email: String
    password: String
    friends: [ID!]
    favoriteBooks: [ID!]
    booksToLend: [ID!]
    booksLent: [ID!]
    booksBorrowed: [ID!]
    gender: String!
    status: String!
    relationshipStatus: [String!]
  }

  type Book {
    _id: ID
    title: String!
    authors: [String]
    image: String
    description: String
    googleBookId: String
    link: String
    owner: ID
    borrower: ID
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

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    booksLending:[Book]!
    book(bookId: ID!): Book
    me: Profile
    queryFavoriteBooks(profileId: ID!): [Book]
    queryMyFavoriteBooks: [Book]
    queryMyLendingBooks: [Book]
    queryMyBorrowedBooks: [Book]
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!, gender: String!, status: String!): Auth
    login(email: String!, password: String!): Auth
    addFavBook(bookId: ID!): Profile
    removeFavBook(bookId: ID!): Profile
    addFriend(profileId: ID!): Profile
    removeFriend(profileId: ID!): Profile
    addBooksToLend(bookId: ID!): Profile
    removeBooksToLend(bookId: ID!): Profile
    addBooksLent(bookId: ID!): Profile
    removeBooksLent(bookId: ID!): Profile
    addBooksBorrowed(bookId: ID!): Profile
    removeBooksBorrowed(bookId: ID!): Profile
    updateProfileStatus(newStatus: String!): Profile
    removeProfile: Profile
    addBook(title: String!, authors: [String], image: String, description: String, googleBookId: String, link: String,owner: ID, borrower: ID, isAvailable: Boolean!): Book
    updateBookBorrower(bookId: ID!, profileId: ID!): Book
    updateBookAvailability(bookId: ID!): Book
    openLedger(bookId: ID!, lender: ID!, borrower: ID!, status: Boolean!): Ledger
    closeLedger(ledgerId: ID!): Ledger
  }
`;

module.exports = typeDefs;
