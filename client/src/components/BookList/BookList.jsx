import { Container, Col, Card, Row, Button } from "react-bootstrap";
import auth from "../../utils/auth";
import { useMutation } from "@apollo/client";
import { REMOVE_FAVBOOK } from "../../utils/mutations";

export default function BookList({ books }) {

  const [removeFavBook, { loading, data, error }] = useMutation(REMOVE_FAVBOOK, {
    refetchQueries: ["me"]
  })

  const handleRemoveFavBook = async (book) => {
    console.log("book info: ", book)
    const bookId = book._id

    try {
      const response = await removeFavBook({
        variables: { bookId: bookId }
      })
      console.log('response: ', response)
    } catch (e) {
      console.log(e)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <h2 className="pt-5">
        {books?.length
          ? `Viewing ${books?.length} results:`
          : "There is no favorite books yet!"}
      </h2>
      <Row>
        {books?.map((book) => {
          return (
            <Col md="4" key={book._id}>
              <Card key={book._id} className="custom-card" border="dark">
                <Card.Title>{book.title}</Card.Title>
                {book.image ? (
                  <Card.Img
                    src={book.image || "No image available"}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                    style={{
                      maxWidth: "150px",
                      objectFit: "cover",
                      margin: "auto",
                    }}
                  />
                ) : null}

                <Card.Body>
                  <p className="small">
                    Authors: {book.authors || "No authors listed"}
                  </p>
                </Card.Body>
                <Button onClick={() => handleRemoveFavBook(book)}>Remove</Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
