import { Container, Col, Card, Row, Button } from "react-bootstrap";
import "./SearchedBookResults.scss";
import auth from "../../utils/auth";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";
import { FAV_BOOK, LEND_BOOK } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import LendModalConfirmation from "../Modal-Confirmation/LendModalConfirmation";

function SearchedBookResults({ searchedBooks, userData }) {
  // sets up mutation to add book to favorites list
  const [
    addFavBook,
    { loading: favBookLoading, data: favBookData, error: favBookError },
  ] = useMutation(FAV_BOOK, {
    refetchQueries: ["me"],
  });

  // sets up mutation to add book to lending list
  const [
    addBooksToLend,
    { loading: lendBookLoading, data: lendBookData, error: lendBookError },
  ] = useMutation(LEND_BOOK, {
    refetchQueries: ["me"],
  });

  const [favBookIds, setFavBookIds] = useState(
    userData
      ? userData.favoriteBooks?.map((favoriteBooks) => {
          return favoriteBooks.googleBookId;
        })
      : []
  );

  const [lendBookIds, setLendBookIds] = useState(
    userData
      ? userData.booksToLend?.map((booksToLend) => {
          return booksToLend.googleBookId;
        })
      : []
  );

  // on button press, takes in book data and creates book in database then adds to user's favorite list
  const handleFavBook = async (googleBookId) => {
    const bookToFavorite = searchedBooks.find(
      (book) => book.googleBookId === googleBookId
    );
    console.log("booktofavorite: ", bookToFavorite);

    try {
      const response = await addFavBook({
        variables: { book: bookToFavorite },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="search-results-container">
      <Row>
        {searchedBooks.map((book) => {
          return (
            <Col md="4" key={book.googleBookId}>
              <div className="custom-search-card" border="dark">
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
                    {book.authors?.length === 1
                      ? "Author: "
                      : book.authors?.length
                      ? "Authors: "
                      : "No authors listed"}
                    {book.authors?.length ? book.authors.join(", ") : null}
                  </p>

                  {auth.loggedIn() ? (
                    <div>
                      <button
                        disabled={favBookIds?.some(
                          (favoritedBookId) =>
                            favoritedBookId === book.googleBookId
                        )}
                        className="btn-add-fav"
                        onClick={() => {
                          setFavBookIds((favBookIds) => [
                            ...favBookIds,
                            book.googleBookId,
                          ]);
                          handleFavBook(book.googleBookId);
                        }}>
                        {favBookIds?.some(
                          (favoritedBookId) =>
                            favoritedBookId === book.googleBookId
                        )
                          ? "Favorited"
                          : "Add to Favorites"}
                      </button>
                      <div>
                        <LendModalConfirmation
                          book={book}
                          books={searchedBooks}
                          type={"Return"}
                          lendBookIds={lendBookIds}
                          setLendBookIds={setLendBookIds}
                        />
                      </div>
                    </div>
                  ) : null}
                </Card.Body>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default SearchedBookResults;
