import { Container, Col, Card, Row, Button } from "react-bootstrap";
import "./SearchedBookResults.scss";
import auth from "../../utils/auth";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";
import { FAV_BOOK, LEND_BOOK } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { favoritedBookIds } from "../../utils/localStorage";

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

  // function updateSavDisplay() {
  //   setFavBookIds(
  //     userData
  //       ? userData.favoriteBooks?.map((favoriteBooks) => {
  //           return favoriteBooks.googleBookId;
  //         })
  //       : []
  //   );
  // }

  // on button press, takes in book data and creates book in database then adds to user's favorite list
  const handleFavBook = async (googleBookId) => {
    console.log("Book Info: ", googleBookId);
    const bookToFavorite = searchedBooks.find(
      (book) => book.googleBookId === googleBookId
    );
    console.log("booktofavorite: ", bookToFavorite);

    try {
      const response = await addFavBook({
        variables: { book: bookToFavorite },
      });
      console.log("response: ", response);
      console.log("favBookIds from user? ", favBookIds);
      // updateSavDisplay();
    } catch (e) {
      console.log(e);
      // updateSavDisplay();
    }
  };

  // on button press, takes in book data and creates book in database then adds to user's lending list
  const handleLendBook = async (googleBookId) => {
    console.log("Book Info: ", googleBookId);
    const bookToLend = searchedBooks.find(
      (book) => book.googleBookId === googleBookId
    );

    try {
      const response = await addBooksToLend({
        variables: { book: bookToLend },
      });
      console.log("response: ", response);
    } catch (e) {
      console.log(e);
    }
  };

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
            <Col md="4" key={book.googleBookId}>
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
                    <div>
                      <Button
                        disabled={favBookIds?.some(
                          (favoritedBookId) =>
                            favoritedBookId === book.googleBookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => {
                          setFavBookIds((favBookIds) => [
                            ...favBookIds,
                            book.googleBookId,
                          ]);
                          handleFavBook(book.googleBookId);
                        }}
                      >
                        {favBookIds?.some(
                          (favoritedBookId) =>
                            favoritedBookId === book.googleBookId
                        )
                          ? "Favorited"
                          : "Add to Favorites"}
                      </Button>
                      <Button
                        // disabled={favBookIds?.some(
                        //   (favoritedBookId) =>
                        //     favoritedBookId === book.googleBookId
                        // )}
                        className="btn-block btn-info"
                        onClick={() => handleLendBook(book.googleBookId)}
                      >
                        Add to Lending List
                        {/* {favBookIds?.some(
                          (favoritedBookId) =>
                            favoritedBookId === book.googleBookId
                        )
                          ? "Favorited"
                          : "Add to Favorites"} */}
                      </Button>
                    </div>
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
