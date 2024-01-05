import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Container, Col, Form, Button, Row } from "react-bootstrap";
import SearchedBookResults from "../SearchedBookResults/SearchedBookResults";
import "../SearchedBookResults/SearchedBookResults.scss";
// import auth from "../../utils/auth";
import { searchGoogleBooks } from "../../utils/API";
import {
  favoritedBookIds,
  // getFavBookIds,
  // removeFavBookId,
} from "../../utils/localStorage";
import { QUERY_ME } from "../../utils/queries";
import { FAV_BOOK } from "../../utils/mutations";

const BuildBookList = () => {
  const [addBook, { error }] = useMutation(FAV_BOOK);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { loading: profileLoading, data: profileData } = useQuery(QUERY_ME);

  const userData = profileData?.me;

  const [favBookIds, setFavBookIds] = useState(
    userData
      ? userData.favoriteBooks?.map((book) => {
          return book.bookId;
        })
      : []
  );

  useEffect(() => {
    return () => favoritedBookIds(favBookIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || ["No description yet"],
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavBook = async (bookId) => {
    console.log("Book Info: ", bookId);
    const bookToFavorite = searchedBooks.find((book) => book.bookId === bookId);
    console.log("booktofavorite: ", bookToFavorite);

    console.log("userdata: ", userData);

    try {
      const response = await addBook({
        variables: { book: bookToFavorite },
      });
      console.log("response from addBook: ", response);
    } catch (e) {
      console.log(e);
    }
  };

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="search-container">
        <Container>
          <h1>Populate your own lending library here!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>


      <SearchedBookResults searchedBooks={searchedBooks} favBookIds={favBookIds} handleFavBook={handleFavBook}  ></SearchedBookResults>
    </>
  );
};

export default BuildBookList;
