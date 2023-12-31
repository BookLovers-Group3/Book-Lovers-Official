import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/queries";
import { QUERY_Favorite_Books } from "../../utils/queries";

export default function MePage() {
  // query the user information from the token
  const { loading: profileLoading, data: profileData } = useQuery(QUERY_ME);
  const user = profileData?.me;
  // query the user's favorite books
  const { loading: favoriteBooksLoading, data: favoriteBooksData } = useQuery(
    QUERY_Favorite_Books,
    {
      variables: { profileId: user?._id },
    }
  );
  const favoriteBooks = favoriteBooksData.queryFavoriteBooks;
  const favoriteBookList = favoriteBooks.map((book) => {
    return <div key={book._id}>{book.title}</div>;
  });
  // const favBooks = userData.;

  if (profileLoading || favoriteBooksLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      MePage
      <div>Welcome back! {user.name}</div>
      <div>Below are your favorite books </div>
      <div>{favoriteBookList}</div>
    </div>
  );
}
