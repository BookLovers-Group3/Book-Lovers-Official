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
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: Profile
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addSkill(profileId: ID!, skill: String!): Profile
    removeProfile: Profile
    removeSkill(skill: String!): Profile
  }
`;

module.exports = typeDefs;
