import { useQuery } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { QUERY_SINGLE_PROFILE } from "../../utils/queries";
import Auth from "../../utils/auth";

export default function ProfilePage() {
  const { profileId } = useParams();
  // query the profile info based on the profileId
  const { loading, data } = useQuery(QUERY_SINGLE_PROFILE, {
    variables: { profileId: profileId },
  });

  const profile = data?.profile;
  const favoriteBooks = data?.queryFavoriteBooks;
  const favBookList = favoriteBooks?.map((book) => {
    return (
      <div key={book._id}>
        <div>{book.title}</div>
      </div>
    );
  });

  // Use React Router's `<Navigate />` component to redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === profileId) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      ProfilePage
      <div>This is {profile.name}'s Page</div>
      <div>Favorite Books are {favBookList}</div>
    </div>
  );
}
