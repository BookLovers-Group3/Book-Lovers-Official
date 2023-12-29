const typeDefs = `
  scalar Date

  type Profile {
    _id: ID
    name: String
    email: String
    password: String
    friends: [ID!]!
    favoriteBooks: [ID!]!
    booksToLend: [ID!]!
    booksLent: [ID!]!
    booksBorrowed: [ID!]!
    gender: String!
    status: String!
    relationshipStatus: [String!]!
  }

  type Book {
    _id: ID
    title: String!
    authors: [String]
    image: String
    description: String
    bookId: String!
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
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    books:[Book]!
    book(bookId: ID!): Book
    me: Profile
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
    updateStatus(newStatus: String!): Profile
    removeProfile: Profile
  }
`;

module.exports = typeDefs;
