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
      <h2 className="selected-book">
        Your selected book is: <br />
        {book.title}
      </h2>
      <div className="single-book-container max-width-border-top">
        <div className="single-book-details">
          <img src={book.image} alt="" />
          <ModalBookDescription book={book} />
        </div>
        <div className = "single-book-user">
          <div>By: {book.authors}</div>
          <div>Book Status: {book.isAvailable ? "Available" : "Unavailable"}</div>
          <div>Owner: {book.owner.name}</div>
          <div className="request-book-button">
            <ModalConfirmation
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              book={book}
              type={"Request"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
