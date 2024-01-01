import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import SearchedBookResults from "../SearchedBookResults/SearchedBookResults";
import "../SearchedBookResults/SearchedBookResults.scss";
import { searchGoogleBooks } from "../../utils/API";

const BuildBookList = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // const [savedBookIds, setSavedBookIds] = useState(
  //     userData
  //       ? userData.savedBooks?.map((book) => {
  //           return book.bookId;
  //         })
  //       : []
  // )

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
      <SearchedBookResults searchedBooks={searchedBooks}></SearchedBookResults>
    </>
  );
};

export default BuildBookList;
