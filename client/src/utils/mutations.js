import { gql } from "@apollo/client";

export const ADD_PROFILE = gql`
  mutation addProfile(
    $name: String!
    $email: String!
    $password: String!
    $gender: String!
    $status: String!
    $lookingFor: [String!]
    $favoriteGenres: [String!]
  ) {
    addProfile(
      name: $name
      email: $email
      password: $password
      gender: $gender
      status: $status
      lookingFor: $lookingFor
      favoriteGenres: $favoriteGenres
    ) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const UPDATE_PROFILE_IMAGE = gql`
  mutation updateProfileImage($image: String!) {
    addProfileImage(image: $image) {
      _id
      name
    }
  }
`;

// add to favorites
export const FAV_BOOK = gql`
  mutation addFavBook($book: BookInput!) {
    addFavBook(book: $book) {
      _id
      name
      favoriteBooks {
        _id
      }
    }
  }
`;

// add to lending list
export const LEND_BOOK = gql`
  mutation addBooksToLend($book: BookInput!) {
    addBooksToLend(book: $book) {
      _id
      name
      booksToLend {
        _id
      }
    }
  }
`;

// remove from favorites
export const REMOVE_FAVBOOK = gql`
  mutation removeFavBook($bookId: ID!) {
    removeFavBook(bookId: $bookId) {
      _id
    }
  }
`;
// remove from lending list
export const REMOVE_LENDING_BOOK = gql`
  mutation removeLendingBook($bookId: ID!) {
    removeBooksToLend(bookId: $bookId) {
      _id
    }
  }
`;

// add friend
export const ADD_FRIEND = gql`
  mutation addFriend($profileId: ID!) {
    addFriend(profileId: $profileId) {
      _id
      name
      friends {
        _id
      }
    }
  }
`;

// remove a friend
export const REMOVE_FRIEND = gql`
  mutation removeFriend($profileId: ID!) {
    removeFriend(profileId: $profileId) {
      _id
    }
  }
`;

// create a ledger
export const OPEN_LEDGER = gql`
  mutation openLedger($bookId: ID!, $lender: ID!, $borrower: ID!) {
    openLedger(bookId: $bookId, lender: $lender, borrower: $borrower) {
      _id
      bookId
      lender
      borrower
      lendDate
      returnDate
      status
    }
  }
`;

// close a ledger
export const CLOSE_LEDGER = gql`
  mutation closeLedger($bookId: ID!) {
    closeLedger(bookId: $bookId) {
      _id
      bookId
      lender
      borrower
      lendDate
      returnDate
      status
    }
  }
`;
