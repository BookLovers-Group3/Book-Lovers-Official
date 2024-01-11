import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { QUERY_BOOKS_LENDING } from "../../utils/queries";
import { useEffect } from "react";
import Auth from "../../utils/auth";
import { Navigate } from "react-router-dom";
import { Container, Col, Card, Row } from "react-bootstrap";

export default function BookLendingListPage() {
  // query all books that are currently in lending state
  const { loading, data, refetch } = useQuery(QUERY_BOOKS_LENDING, {
    fetchPolicy: "no-cache",
  });

  // Refetch the data when it changes
  useEffect(() => {
    refetch();
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(data);

  // if not logged in, go to the homepage
  if (!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  const books = data?.booksLending;
  console.log(books);
  const bookLendingList = data?.booksLending.map((book) => {
    return (
      <Col md="4" key={book._id}>
        <Card key={book._id} className="custom-card" border="dark">
          <Card.Title>{book?.title}</Card.Title>
          <Link to={`/book/${book._id}`}>
            {book?.image ? (
              <Card.Img
                src={book?.image || "No image available"}
                alt={`The cover for ${book?.title}`}
                variant="top"
                style={{
                  maxWidth: "150px",
                  objectFit: "cover",
                  margin: "auto",
                }}
              />
            ) : null}
          </Link>

          <Card.Body>
            <p className="small">
              Authors: {book?.authors || "No authors listed"}
            </p>
            <Link to={`/profile/${book.owner._id}`}>
              <p className="small">Owner: {book.owner.name}</p>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  });

  return (
    <Container>
      <h2 className="pt-5">
        {books?.length ? `Viewing ${books?.length} books:` : `No books yet`}
      </h2>
      <Row>{bookLendingList}</Row>
    </Container>
  );
}
