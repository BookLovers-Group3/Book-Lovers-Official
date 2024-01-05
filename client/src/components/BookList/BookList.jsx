import { Container, Col, Card, Row, Button } from "react-bootstrap";
import auth from "../../utils/auth";

export default function BookList({ user }) {
  const favoriteBooks = user.favoriteBooks;
  return (
    <Container>
      <h2 className="pt-5">
        {favoriteBooks.length
          ? `Viewing ${favoriteBooks.length} results:`
          : "There is no favorite books yet!"}
      </h2>
      <Row>
        {favoriteBooks?.map((book) => {
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
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
