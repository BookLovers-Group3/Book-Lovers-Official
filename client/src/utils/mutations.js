import { gql } from "@apollo/client";

export const ADD_PROFILE = gql`
  mutation addProfile(
    $name: String!
    $email: String!
    $password: String!
    $gender: String!
    $status: String!
  ) {
    addProfile(
      name: $name
      email: $email
      password: $password
      gender: $gender
      status: $status
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
  mutation addBook($book: BookInput!) {
    addBook(book: $book) {
      _id
    }
    
  }
    
`

// favoriteBook (book: $book) {
//   _id
//   name
//   favoriteBooks {
//       _id
//   }
// }

// add to lending list

// remove from favorites

// remove from lending list

// add book record
// export const ADD_BOOK = gql`
//   mutation AddBook($book: BookInput!) {
//     addBook(book: $book) {
//       bookId
//       authors
//       title
//       description
//       image
//       link
//     }
//   }
// `