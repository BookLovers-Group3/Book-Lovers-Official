import { useState, useEffect } from 'react';
import { useMutation, useQuery } from "@apollo/client";
import {
    Container,
    Col,
    Form,
    Button,
    Card,
    Row
} from 'react-bootstrap';

import auth from '../../../../server/utils/auth';
import { searchGoogleBooks } from "../../utils/API";
import { QUERY_ME } from "../../utils/queries"
import { FAV_BOOK } from '../../utils/mutations';

const BuildBookList = () => {
    const [favoriteBook, { error, data }] = useMutation(FAV_BOOK);

    const [searchedBooks, setSearchedBooks] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const userData = data?.me

    const [favBookIds, setFavBookIds] = useState(
      userData
        ? userData.savedBooks?.map((book) => {
            return book.bookId;
          })
        : []
    )

    useEffect(() => {
      console.log('favBookIds: ', favBookIds)
      return () => saveBookIds(favBookIds);
    });

    const handleFormSubmit = async (event) => {
      event.preventDefault();

      if (!searchInput) {
        return false;
      }

      try {
        const response = await searchGoogleBooks(searchInput);

        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const { items } = await response.json();

        const bookData = items.map((book) => ({
          bookId: book.id,
          authors: book.volumeInfo.authors || ['No author to display'],
          title: book.volumeInfo.title,
          description: book.volumeInfo.description || ['No description yet'],
          image: book.volumeInfo.imageLinks?.thumbnail || '',
        }));

        setSearchedBooks(bookData);
        setSearchInput('');
      } catch (err) {
        console.error(err);
    }};

    const handleFavBook = async (bookId) => {
      console.log('Book Info: ', bookId)
      const bookToFavorite = searchedBooks.find((book) => book.bookId === bookId);

      try {
        const { data } = await favoriteBook({
          variables: { bookToFavorite }
        })
      } catch (e) {
        console.log(e)
      }
    };

    return (
      <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Populate your own lending library here!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
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
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleFavBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
    );
};  
  
export default BuildBookList;