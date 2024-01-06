import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/queries";
import { Navigate } from "react-router-dom";
import LibraryCard from "../LibraryCard/LibraryCard";
import Auth from "../../utils/auth";

export default function MePage() {
  // query the user information from the token, QUERY_ME will query the user info, as well as user's favorite books, and user's lending books and the user's borrowed books
  const { loading: profileLoading, data: profileData } = useQuery(QUERY_ME);
  // user info
  const user = profileData?.me;

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
