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
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
    }
    queryMyFavoriteBooks {
      _id
      authors
      title
      description
    }
    queryMyLendingBooks {
      _id
      authors
      title
      description
    }
    queryMyBorrowedBooks {
      _id
      authors
      title
      description
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
      owner
      title
    }
  }
`;

export const QUERY_FAVORITE_BOOKS = gql`
  query QueryFavoriteBooks($profileId: ID!) {
    queryFavoriteBooks(profileId: $profileId) {
      _id
      authors
      title
      description
    }
  }
`;

export const QUERY_MY_FAVORITE_BOOKS = gql`
  query QueryMyFavoriteBooks {
    queryMyFavoriteBooks {
      _id
      authors
      title
      description
    }
  }
`;
