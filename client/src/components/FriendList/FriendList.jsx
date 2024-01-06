import { Container, Col, Card, Row, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REMOVE_FAVBOOK, REMOVE_LENDING_BOOK } from "../../utils/mutations";

export default function FriendList({ friends }) {
  // get mutation for remove favorite book
  // const [
  //   removeFavBook,
  //   { loading: favLoading, data: favData, error: favError },
  // ] = useMutation(REMOVE_FAVBOOK, {
  //   refetchQueries: ["me"],
  // });
  // get mutation for remove lending book
  // const [
  //   removeLendingBook,
  //   { loading: lendingLoading, data: lendingData, error: lendingError },
  // ] = useMutation(REMOVE_LENDING_BOOK, {
  //   refetchQueries: ["me"],
  // });

  // define function for remove favorite book
  // const handleRemoveFavBook = async (book) => {
  //   console.log("book info: ", book);

  //   try {
  //     const response = await removeFavBook({
  //       variables: { bookId: book._id },
  //     });
  //     console.log("response: ", response);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // define function for remove lending book
  // const handleRemoveLendingBook = async (book) => {
  //   console.log("book info: ", book);

  //   try {
  //     const response = await removeLendingBook({
  //       variables: { bookId: book._id },
  //     });
  //     console.log("response: ", response);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // define function for choose which type of book to remove
  // const handleRemoveBook = (book) => {
  //   if (type === "favorite") {
  //     return handleRemoveFavBook(book);
  //   }
  //   if (type === "lending") {
  //     return handleRemoveLendingBook(book);
  //   }
  // };
  const removeFriend = () => {
    console.log("Remove Friend");
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
                <Button onClick={() => removeFriend(friend)}>Remove</Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
