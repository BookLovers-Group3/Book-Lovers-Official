import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { QUERY_SINGLE_PROFILE } from "../../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { Container, Col, Card, Row, Button } from "react-bootstrap";
import LibraryCard from "../LibraryCard/LibraryCard";

export default function ProfilePage() {
  //set the isFriend status as a state
  const [youAreTheirFriend, setYouAreTheirFriend] = useState(false);

  const [theyAreYourFriend, setTheyAreYourFriend] = useState(false);

  //get profileId from the params
  const { profileId } = useParams();
  // query the profile info based on the profileId
  const { loading, data } = useQuery(QUERY_SINGLE_PROFILE, {
    variables: { profileId: profileId },
  });

  // get all the profile info based on the profileId from params
  const profile = data?.profile;
  const user = profile
  const friends = profile?.friends;
  const favoriteBooks = profile?.favoriteBooks;
  const booksToLend = profile?.booksToLend;
  
  // mutation for adding friend
  const [addFriend, { loading: addLoading, data: addData, error: addError }] =
    useMutation(ADD_FRIEND, {
      refetchQueries: ["singleProfile", "me"],
    });

  // mutation for removing friend
  const [removeFriend, { loading: removeLoading, data: removeData, error: removeError }] = 
    useMutation(REMOVE_FRIEND, {
      refetchQueries: ["singleProfile", "me"]
    })


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

  // check if the current user is the profile page user's friend
  useEffect(() => {
    if (friends && friends.length > 0) {
      for (const friend of friends) {
        if (friend._id === Auth?.getProfile().data._id) {
          setYouAreTheirFriend(true);
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
    setTheyAreYourFriend(true)
  };

  // define function to remove friend
  const handleRemoveFriend = async () => {
    const response = await removeFriend({
      variables: { profileId: profileId }
    });
    setTheyAreYourFriend(false)
  }

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

  // if not logged in, go to the homepage
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {theyAreYourFriend && youAreTheirFriend ? (
        <div>
          <p>You and {profile?.name} are friends!</p>
          <Button onClick={() => handleRemoveFriend()}>Remove Friend</Button>
        </div>
      ) : (
        <div>
          <p>You are not {profile?.name}'s friend</p>
          <Button onClick={() => handleAddFriend()}>Add Friend</Button>
        </div>
      )}
      <LibraryCard user={user} />
    </div>
  );
}
