import { Container, Col, Card, Row, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REMOVE_FRIEND } from "../../utils/mutations";

export default function FriendList({ friends }) {
  // get mutation for remove friend
  const [removeFriend, { loading, data, error }] = useMutation(REMOVE_FRIEND, {
    refetchQueries: ["me"],
  });

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
    <Container>
      <h2 className="pt-5">
        {friends?.length
          ? `You have ${friends?.length} friends:`
          : "You have no friends yet"}
      </h2>
      <Row>
        {friends?.map((friend) => {
          return (
            <Col md="4" key={friend._id}>
              <Card key={friend._id} className="custom-card" border="dark">
                <Card.Title>{friend.name}</Card.Title>
                {friend.profileImage ? (
                  <Card.Img
                    src={friend.profileImage || "No image available"}
                    alt={`The cover for ${friend.name}`}
                    variant="top"
                    style={{
                      maxWidth: "150px",
                      objectFit: "cover",
                      margin: "auto",
                    }}
                  />
                ) : null}
                <Button onClick={() => handleRemoveFriend(friend)}>
                  Unfriend
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
