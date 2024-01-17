import { Container, Col, Card, Row, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REMOVE_FRIEND } from "../../utils/mutations";
import { Link } from "react-router-dom";
import "./FriendList.scss";

export default function FriendList({ friends, isMe }) {
  // get mutation for remove friend
  const [removeFriend, { loading, data, error }] = useMutation(REMOVE_FRIEND, {
    refetchQueries: ["me"],
  });

  // remove friend on button click
  const handleRemoveFriend = async (friend) => {
    console.log("Remove Friend", friend);
    try {
      const response = await removeFriend({
        variables: { profileId: friend._id },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="custom-friends-container">
      <h2 className="pt-5">
        {friends?.length === 1
          ? "1 friend:"
          : friends?.length
          ? `${friends?.length} friends:`
          : "No friends yet"}
      </h2>
      <div className="custom-friend-container">
        {friends?.map((friend) => {
          return (
            <Col md="4" key={friend._id}>
              <section
                key={friend._id}
                className="custom-friend-card"
                border="dark">
                <h3>
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/profile/${friend._id}`}>
                    {friend.name}
                  </Link>
                </h3>

                <div className="friend-card">
                  {friend.profileImage && (
                    <img
                      src={friend.profileImage}
                      alt={`The cover for ${friend.name}`}
                      variant="top"
                      style={{
                        maxWidth: "150px",
                        objectFit: "cover",
                        margin: "auto",
                      }}
                    />
                  )}
                  {isMe && (
                    <button
                      style={{ width: "100px", margin: "10px auto 0" }}
                      onClick={() => handleRemoveFriend(friend)}>
                      Unfriend
                    </button>
                  )}
                </div>
              </section>
            </Col>
          );
        })}
      </div>
    </div>
  );
}
