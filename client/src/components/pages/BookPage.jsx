import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_BOOK } from "../../utils/queries";
import { useParams } from "react-router-dom";
import ModalBookDescription from "../Modal-BookDescription/ModalBookDescription";
import "./Page.scss";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalConfirmation from "../Modal-Confirmation/ModalConfirmation";

export default function BookPage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get the bookId from the params
  const { bookId } = useParams();
  // manually setup the bookId here for test purpose
  const { loading: bookLoading, data: bookData } = useQuery(QUERY_SINGLE_BOOK, {
    variables: { bookId: bookId },
  });

  const book = bookData?.book;

  if (bookLoading) {
    return <div>Loading...</div>;
  }

  console.log(book);
  if (book && !book._id) {
    return <h4>No such book exist</h4>;
  }

  return (
    <>
      <h2>Your selected book is {book.title}</h2>
      <div className="single-book-container">
        <div className="single-book-details">
          <img src={book.image} alt="" />
          <div>{book.title}</div>
        </div>
        <div>
          <div>By: {book.authors}</div>
          <ModalBookDescription book={book} />
          <div>Posted by: This is the place-holder for bookowner</div>
          <div>Available: {book.isAvailable ? "Available" : "Unavailable"}</div>
        </div>
      </div>
      <div className="request-book-button">
        <ModalConfirmation
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          book={book}
          type={"Request"}
        />
      </div>
    </>
  );
}
