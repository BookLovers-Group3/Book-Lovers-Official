import { gql } from "@apollo/client";

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      gender
      profileImage
      friends {
        _id
        name
        profileImage
      }
      favoriteBooks {
        _id
        authors
        title
        description
        image
      }
      booksToLend {
        _id
        authors
        title
        description
        image
        isAvailable
      }
      booksLent {
        _id
        authors
        title
        description
        image
      }
      booksBorrowed {
        _id
        authors
        title
        description
        image
      }
      favoriteGenres
      lookingFor
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
      profileImage
      gender
      favoriteBooks {
        _id
        googleBookId
        authors
        title
        description
        image
      }
      booksToLend {
        _id
        googleBookId
        authors
        title
        description
        image
        isAvailable
      }
      booksLent {
        _id
        authors
        title
        description
        image
      }
      booksBorrowed {
        _id
        authors
        owner {
          name
          email
        }
        title
        description
        image
        owner {
          name
          email
        }
      }
      friends {
        _id
        name
        profileImage
      }
      favoriteGenres
      lookingFor
    }
  }
`;

export const QUERY_BOOKS_LENDING = gql`
  query booksLending {
    booksLending {
      _id
      authors
      description
      image
      title
      owner {
        _id
        name
        email
      }
    }
  }
`;

export const QUERY_SINGLE_BOOK = gql`
  query singleBook($bookId: ID!) {
    book(bookId: $bookId) {
      _id
      title
      authors
      image
      description
      isAvailable
      owner {
        _id
        name
        email
      }
      borrower {
        _id
      }
    }
  }
`;

export const QUERY_LEDGER = gql`
  query getUserBookCount($profileId: ID!) {
    getUserBookCount(profileId: $profileId) {
      count
    }
  }
`;

export const QUERY_LEDGER_SPECIFC_USER = gql`
  query getBorrowCountFromSpecificUser($profileId: ID!) {
    getBorrowCountFromSpecificUser(profileId: $profileId) {
      borrowCount
    }
  }
`;
