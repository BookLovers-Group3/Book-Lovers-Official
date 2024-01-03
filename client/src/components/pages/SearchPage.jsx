import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import SearchedBookResults from "../SearchedBookResults/SearchedBookResults";
import "../SearchedBookResults/SearchedBookResults.scss";
import auth from '../../utils/auth';
import { searchGoogleBooks } from "../../utils/API";
import { favoritedBookIds, getFavBookIds, removeFavBookId } from '../../utils/localStorage';
import { QUERY_ME } from "../../utils/queries"
import { FAV_BOOK } from '../../utils/mutations';

const BuildBookList = () => {
    const [addBook, { error }] = useMutation(FAV_BOOK);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

    const { loading, data } = useQuery(QUERY_ME);

    const userData = data?.me

    const [favBookIds, setFavBookIds] = useState(
      userData
        ? userData.favoriteBooks?.map((book) => {
            return book.bookId;
          })
        : []
    )

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
      console.log('Book Info: ', bookId)
      const bookToFavorite = searchedBooks.find((book) => book.bookId === bookId);
      console.log('booktofavorite: ', bookToFavorite)

      console.log("userdata: ", userData)

      try {
        const response = await addBook({
          variables: { book: bookToFavorite }
        })
        console.log('response from addBook: ', response)
      } catch (e) {
        console.log(e)
      }
    };

    if (loading) {
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

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to add it to your personal library list'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {auth.loggedIn() && (
                      <Button
                        disabled={favBookIds?.some((favoritedBookId) => favoritedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleFavBook(book.bookId)}>
                        {favBookIds?.some((favoritedBookId) => favoritedBookId === book.bookId)
                          ? 'Favorited'
                          : 'Add to Favorites'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <SearchedBookResults searchedBooks={searchedBooks}></SearchedBookResults>
    </>
  );
};

export default BuildBookList
