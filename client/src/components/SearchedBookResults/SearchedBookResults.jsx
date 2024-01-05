import { Container, Col, Card, Row, Button } from "react-bootstrap";
import "./SearchedBookResults.scss";
import auth from "../../utils/auth";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";

function SearchedBookResults({ searchedBooks, favBookIds, handleFavBook }) {
  return (
    <Container>
      <h2 className="pt-5">
        {searchedBooks.length
          ? `Viewing ${searchedBooks.length} results:`
          : "Search for a book to add it to your personal library list"}
      </h2>
      <Row>
        {searchedBooks.map((book) => {
          return (
            <Col md="4" key={book.bookId}>
              <Card className="custom-card" border="dark">
                <Card.Title>{book.title}</Card.Title>
                <ModalBookDescription
                  title={book.title}
                  description={book.description}
                />
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

                  {auth.loggedIn() && (
                    <Button
                      disabled={favBookIds?.some(
                        (favoritedBookId) => favoritedBookId === book.bookId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleFavBook(book.bookId)}>
                      {favBookIds?.some(
                        (favoritedBookId) => favoritedBookId === book.bookId
                      )
                        ? "Favorited"
                        : "Add to Favorites"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default SearchedBookResults;
