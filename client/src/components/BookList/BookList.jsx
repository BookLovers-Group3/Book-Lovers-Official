import { Col, Card, Row, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REMOVE_FAVBOOK, REMOVE_LENDING_BOOK } from "../../utils/mutations";
import { Link } from "react-router-dom";
import ModalConfirmation from "../Modal-Confirmation/ModalConfirmation";
import "./BookList.scss";

export default function BookList({ books, type, isMe }) {
  // get mutation for remove favorite book
  const [
    removeFavBook,
    { loading: favLoading, data: favData, error: favError },
  ] = useMutation(REMOVE_FAVBOOK, {
    refetchQueries: ["me"],
  });

  // get mutation for remove lending book
  const [
    removeLendingBook,
    { loading: lendingLoading, data: lendingData, error: lendingError },
  ] = useMutation(REMOVE_LENDING_BOOK, {
    refetchQueries: ["me"],
  });

  // define function for remove favorite book
  const handleRemoveFavBook = async (book) => {
    console.log("book info: ", book);

    try {
      const response = await removeFavBook({
        variables: { bookId: book._id },
      });
      console.log("response: ", response);
    } catch (e) {
      console.log(e);
    }
  };

  // define function for remove lending book
  const handleRemoveLendingBook = async (book) => {
    console.log("book info: ", book);

    try {
      const response = await removeLendingBook({
        variables: { bookId: book._id },
      });
      console.log("response: ", response);
    } catch (e) {
      console.log(e);
    }
  };

  // define function for choose which type of book to remove
  const handleRemoveBook = (book) => {
    if (type === "favorite") {
      return handleRemoveFavBook(book);
    }
    if (type === "lending") {
      return handleRemoveLendingBook(book);
    }
  };

  return (
    <div className="custom-booklist-container">
      <h2>
        {books?.length
          ? `Viewing ${books?.length} ${type} books:`
          : `No ${type} books yet`}
      </h2>
      <Row>
        {books?.map((book) => {
          return (
            <Col className="custom-booklist-card" md="4" key={book._id}>
              <div
                key={book._id}
                className="custom-card-single"
                border="dark"
                style={{
                  backgroundColor: !book.isAvailable ? null : "#ea97ad",
                }}>
                {type === "lending" ? (
                  <div>
                    <Link to={`/book/${book._id}`} className="custom-link">
                      <Card.Title className="card-title">
                        {book.title}
                      </Card.Title>
                    </Link>
                  </div>
                ) : type === "borrowed" ? (
                  <div>
                    <Link to={`/book/${book._id}`} className="custom-link">
                      <Card.Title className="card-title">
                        {book.title}
                      </Card.Title>
                    </Link>
                  </div>
                ) : (
                  <Card.Title className="card-title">{book.title}</Card.Title>
                )}
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
                  <p className="authors">
                    {book?.authors.length === 1
                      ? "Author: "
                      : book?.authors.length
                      ? "Authors: "
                      : "No author listed"}
                    {book?.authors.join(", ")}
                  </p>
                </Card.Body>
                {isMe ? (
                  type === "borrowed" ? (
                    <ModalConfirmation
                      book={book}
                      books={books}
                      type={"Return"}
                    />
                  ) : (
                    <Button onClick={() => handleRemoveBook(book)}>
                      Remove
                    </Button>
                  )
                ) : null}
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
