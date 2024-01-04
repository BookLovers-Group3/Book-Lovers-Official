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
              <Card border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  {/* <Card.Text>{book.description}</Card.Text> */}
                  <ModalBookDescription description={book.description}/>
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
