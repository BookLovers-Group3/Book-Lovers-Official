import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { QUERY_SINGLE_PROFILE } from "../../utils/queries";
import { ADD_FRIEND } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { Container, Col, Card, Row, Button } from "react-bootstrap";

export default function ProfilePage() {
  //set the isFriend status as a state
  const [isFriend, setIsFriend] = useState(false);
  //get profileId from the params
  const { profileId } = useParams();
  // query the profile info based on the profileId
  const { loading, data } = useQuery(QUERY_SINGLE_PROFILE, {
    variables: { profileId: profileId },
  });
  // mutations for adding friends
  const [addFriend, { loading: addLoading, data: addData, error: addError }] =
    useMutation(ADD_FRIEND, {
      refetchQueries: ["singleProfile"],
    });
  // get all the profile info based on the profileId from params
  const profile = data?.profile;
  const friends = profile?.friends;
  const favoriteBooks = profile?.favoriteBooks;
  const booksToLend = profile?.booksToLend;
  // get the favorite book list
  const favBookList = favoriteBooks?.map((book) => {
    return (
      <div key={book._id}>
        <div>{book.title}</div>
      </div>
    );
  });
  // get the lending book list
  const booksToLendList = booksToLend?.map((book) => {
    return (
      <div key={book._id}>
        <div>{book.title}</div>
      </div>
    );
  });

  // check if the current user and the profile page user are frends
  useEffect(() => {
    if (friends) {
      for (const friend of friends) {
        if (friend._id === Auth.getProfile().data._id) {
          setIsFriend(true);
          break;
        }
      }
    }
  }, [friends]);

  // define function to add friend with each other
  const handleAddFriend = async () => {
    const response = await addFriend({
      variables: { profileId: profileId },
    });
  };
  console.log(isFriend);
  // Use React Router's `<Navigate />` component to redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === profileId) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile?._id) {
    return <h4>No such profile exist</h4>;
  }

  return (
    <div>
      ProfilePage{" "}
      {isFriend ? <p>You are Friends</p> : <p>You are not friends</p>}
      <div>This is {profile?.name}'s Page</div>
      <div>This user's favorite books are {favBookList}</div>
      <div>This user's lending books are {booksToLendList}</div>
      <Button onClick={() => handleAddFriend()}>Add Friend</Button>
    </div>
  );
}
