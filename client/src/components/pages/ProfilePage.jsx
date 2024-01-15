import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { QUERY_SINGLE_PROFILE, QUERY_ME } from "../../utils/queries";
import { ADD_FRIEND, REMOVE_FRIEND } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { Button } from "react-bootstrap";
import LibraryCard from "../LibraryCard/LibraryCard";

export default function ProfilePage() {
  //get profileId from the params
  const { profileId } = useParams();
  // query the profile info based on the profileId
  const { loading, data } = useQuery(QUERY_SINGLE_PROFILE, {
    variables: { profileId: profileId },
  });
  // get all the profile info based on the profileId from params
  const user = data?.profile;
  const userId = user?._id;
  const friends = user?.friends;
  console.log("friendId", userId);
  //this is the user that I am now under
  console.log("profile", user);
  // console.log("user", user)
  const { loading: meLoading, data: meData } = useQuery(QUERY_ME);
  const [youAreTheirFriend, setYouAreTheirFriend] = useState();
  const [theyAreYourFriend, setTheyAreYourFriend] = useState();

  useEffect(() => {
    console.log("meData", meData);

    if (meData?.me?.friends) {
      const isFriend = meData.me.friends.some(
        (friend) => friend._id === userId
      );
      setTheyAreYourFriend(isFriend);
    }
  }, [meData, userId]);

  // mutation for adding friend
  const [addFriend, { loading: addLoading, data: addData, error: addError }] =
    useMutation(ADD_FRIEND, {
      refetchQueries: ["singleProfile", "me"],
    });

  // mutation for removing friend
  const [
    removeFriend,
    { loading: removeLoading, data: removeData, error: removeError },
  ] = useMutation(REMOVE_FRIEND, {
    refetchQueries: ["singleProfile", "me"],
  });

  // check if the current user is the profile page user's friend
  useEffect(() => {
    if (friends && friends.length > 0) {
      for (const friend of friends) {
        if (friend._id === Auth?.getProfile().data._id) {
          setYouAreTheirFriend(true);
          console.log("useEffect to check friends triggered");
          break;
        }
      }
    }
  }, [friends]);

  // define function to add friend with each other
  const handleAddFriend = async () => {
    console.log("Adding friend. Profile ID:", profileId);
    const response = await addFriend({
      variables: { profileId: profileId },
    });
    if (response.data.addFriend) {
      setTheyAreYourFriend(true);
    }
  };

  // define function to remove friend
  const handleRemoveFriend = async () => {
    const response = await removeFriend({
      variables: { profileId: profileId },
    });
    if (response.data.removeFriend) {
      setTheyAreYourFriend(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?._id) {
    return <h4>No such profile exist</h4>;
  }

  // if not logged in, go to the homepage
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  // Use React Router's `<Navigate />` component to redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === profileId) {
    return <Navigate to="/me" />;
  }

  console.log("they are your friend? ", theyAreYourFriend);
  console.log("you are their friend? ", youAreTheirFriend);

  return (
    <div>
      {theyAreYourFriend && youAreTheirFriend ? (
        <div>
          <p>You and {user?.name} are friends!</p>
          {/* <Button onClick={() => handleRemoveFriend()}>Remove Friend</Button> */}
        </div>
      ) : theyAreYourFriend && !youAreTheirFriend ? (
        <div>
          <p>You have added {user?.name} as a friend.</p>
          <p>Start borrowing books!</p>
          {/* <Button onClick={() => handleRemoveFriend()}>Remove Friend</Button> */}
        </div>
      ) : (
        <div>
          <p>You have not added {user?.name} as a friend</p>
          <Button onClick={() => handleAddFriend()}>Add Friend</Button>
        </div>
      )}
      <LibraryCard user={user} youAreTheirFriend={youAreTheirFriend} />
    </div>
  );
}
