import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/queries";
import { Navigate } from "react-router-dom";
import LibraryCard from "../LibraryCard/LibraryCard";
import Auth from "../../utils/auth";

export default function MePage() {
  // query the user information from the token, QUERY_ME will query the user info, as well as user's favorite books, and user's lending books and the user's borrowed books
  const { loading: profileLoading, data: profileData } = useQuery(QUERY_ME);
  console.log(profileData);
  // user info
  const user = profileData?.me;
  // user's favorite books, an array
  const favoriteBooks = user?.favoriteBooks;
  // user's lending books, an array
  const booksToLend = user?.booksToLend;
  // user's borrowed books, an array
  const booksBorrowed = user?.booksBorrowed;

  const favoriteBookList = favoriteBooks?.map((book) => {
    return <div key={book._id}>{book.title}</div>;
  });

  const lendingBookList = booksToLend?.map((book) => {
    return <div key={book._id}>{book.title}</div>;
  });

  // if not logged in, go to the homepage
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  // const favBooks = userData.;

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LibraryCard user={user} />
    </>
  );
}
