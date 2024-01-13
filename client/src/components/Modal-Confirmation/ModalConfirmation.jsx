import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@apollo/client";
import { OPEN_LEDGER, CLOSE_LEDGER } from "../../utils/mutations";
import Auth from "../../utils/auth";
// import {
//   setReturnBookId,
//   getReturnBookId,
//   removeReturnBookId,
// } from "../../utils/localStorage";
import emailjs from "@emailjs/browser";

function ModalConfirmation({ book, type }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // initiate emailjs on component load
  useEffect(() => emailjs.init("tFj6zAOJjHz2zSQ9C"));

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

  // when click on return list, save the book google id into local storage
  const handleReturn = () => {
    handleShow();
    // if (type === "Return") {
    //   setReturnBookId(book._id);
    // }
  };

  //  handle confirm function
  const handleConfirm = async () => {
    // variables for emailjs function
    const serviceId = "book_lovers";
    const borrowTemplateId = "bl-borrow";
    const returnTemplateId = "bl-return";

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
          reply_to: user.data.email,
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (type === "Return") {
      // const returnBookId = getReturnBookId();
      const bookToReturn = book;
      console.log("book to return", bookToReturn);
      try {
        // close the ledger for this book borrow transaction
        const ledger = await closeLedger({
          variables: {
            bookId: bookToReturn._id,
          },
        });
        // removeReturnBookId();
        console.log("ledger", ledger);

        // send email notification for this borrow transaction
        const email = await emailjs.send(serviceId, returnTemplateId, {
          owner_email: book.owner.email,
          to_name: book.owner.name,
          from_name: user.data.name,
          from_email: user.data.email,
          book_name: book.title,
          reply_to: user.data.email,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };
  // if didnt confirm, then close modal and remove the book id from localstorage
  const handleCloseBtn = () => {
    handleClose();
    // removeReturnBookId();
  };

  return (
    <>
      <Button
        className="btn-request"
        variant="primary"
        disabled={
          (type === "Request" && !book.isAvailable) ||
          user.data._id === book.owner?._id
        }
        onClick={() => handleReturn()}
      >
        {book.borrower?._id === user.data._id
          ? "Book Requested"
          : `${type} Book`}
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
