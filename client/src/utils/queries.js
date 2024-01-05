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
      friends {
        _id
        name
      }
      favoriteBooks {
        _id
        authors
        title
        description
      }
      booksToLend {
        _id
        authors
        title
        description
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
      profileImage
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
    }
  }
`;
