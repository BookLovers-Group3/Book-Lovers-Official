<<<<<<< HEAD
=======
import React, { useState, useEffect } from "react";
>>>>>>> main
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@apollo/client";
import { OPEN_LEDGER, CLOSE_LEDGER } from "../../utils/mutations";
import Auth from "../../utils/auth";
<<<<<<< HEAD
import {
  setReturnBookId,
  getReturnBookId,
  removeReturnBookId,
} from "../../utils/localStorage";

function ModalConfirmation({
  handleShow,
  handleClose,
  show,
  book,
  type,
  books,
}) {
  // get user data
  const user = Auth.getProfile();
  // get open ledger mutation
  const [openLedger, { error: openLedgerError, data: openLedgerData }] =
    useMutation(OPEN_LEDGER, {
      refetchQueries: ["singleBook", "me", "booksLending", "singleProfile"],
    });
  // get close ledger mutation
  const [closeLedger, { error: closeLedgerError, data: closeLedgerData }] =
    useMutation(CLOSE_LEDGER, {
      refetchQueries: ["singleBook", "me", "booksLending", "singleProfile"],
    });

  // when click on return list, save the book google id into local storage
  const handleReturn = () => {
    console.log(book);
    handleShow();
    setReturnBookId(book._id);
  };
  //
  const handleConfirm = async () => {
=======
import emailjs from "@emailjs/browser";

function ModalConfirmation({ handleShow, handleClose, show, book, type }) {
  // initiate emailjs on component load
  useEffect(() => emailjs.init("tFj6zAOJjHz2zSQ9C"))

  //get requesting user data
  const user = Auth.getProfile();

  // mutation for adding ledger entry
  const [openLedger, { error: openLedgerError, data: openLedgerData }] =
    useMutation(OPEN_LEDGER, {
      refetchQueries: ["singleBook", "me", "booksLending", "singleProfile"],
  });

  // mutation for closing ledger entry
  const [closeLedger, { error: closeLedgerError, data: closeLedgerData }] =
    useMutation(CLOSE_LEDGER, {
      refetchQueries: ["singleBook", "me", "booksLending", "singleProfile"],
  });

  // const [
  //   updateBookAvailability,
  //   { error: bookUpdateError, data: bookUpdateData },
  // ] = useMutation(UPDATE_BOOK_AVAILABILITY);
  
  const handleRequest = async () => {
    // variables for emailjs function
    const serviceId = "book_lovers"
    const borrowTemplateId = "bl-borrow"
    const returnTemplateId = "bl-return"

    console.log("book", book);
>>>>>>> main
    handleClose();

    if (type === "Request") {
      try {
        // open the ledger for this book borrow transaction
        const ledger = await openLedger({
          variables: {
            bookId: book._id,
            lender: book.owner._id,
            borrower: user.data._id,
          },
        });
        console.log("ledger", ledger);
        // send email notification for this borrow transaction
        const email = await emailjs.send(serviceId, borrowTemplateId, {
          owner_email: book.owner.email,
          to_name: book.owner.name,
          from_name: user.data.name,
          from_email: user.data.email,
          book_name: book.title,
          reply_to: user.data.email
        })
        console.log("email sent with this data: ", email)
      } catch (e) {
        console.error(e);
      }
    }
    if (type === "Return") {
      console.log("return book");
      const returnBookId = getReturnBookId();
      const bookToReturn = books.find((book) => book._id === returnBookId);
      console.log("book to return", bookToReturn);
      try {
        // close the ledger for this book borrow transaction
        const ledger = await closeLedger({
          variables: {
            bookId: bookToReturn._id,
          },
        });
        removeReturnBookId();
        console.log("ledger", ledger);
        // send email notification for this borrow transaction
        const email = await emailjs.send(serviceId, returnTemplateId, {
          owner_email: book.owner.email,
          to_name: book.owner.name,
          from_name: user.data.name,
          from_email: user.data.email,
          book_name: book.title,
          reply_to: user.data.email
        })
        console.log("email sent with this data: ", email)
      } catch (e) {
        console.error(e);
      }
    }
  };
  // if didnt confirm, then close modal and remove the book id from localstorage
  const handleCloseBtn = () => {
    handleClose();
    removeReturnBookId();
  };

  return (
    <>
      <Button className="btn-request" variant="primary" onClick={() => handleReturn()}>
        {type} Book
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {type === "Request" ? "request" : "return"}{" "}
          this book? Confirming will send an email to the owner
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseBtn()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleConfirm()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConfirmation;
