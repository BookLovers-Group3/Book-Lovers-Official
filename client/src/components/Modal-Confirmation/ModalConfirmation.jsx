import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@apollo/client";
import { OPEN_LEDGER, UPDATE_BOOK_AVAILABILITY } from "../../utils/mutations";
import Auth from "../../utils/auth";

function ModalConfirmation({ handleShow, handleClose, show, book }) {
  const user = Auth.getProfile();
  console.log(user);
  console.log("book", book);
  const [openLedger, { error: openLedgerError, data: openLedgerData }] =
    useMutation(OPEN_LEDGER, {
      refetchQueries: ["singleBook"],
    });
  // const [
  //   updateBookAvailability,
  //   { error: bookUpdateError, data: bookUpdateData },
  // ] = useMutation(UPDATE_BOOK_AVAILABILITY);
  const handleRequest = async () => {
    console.log("open ledger");
    console.log("book", book);
    try {
      // open the ledger for this book borrow transaction
      const ledger = await openLedger({
        variables: {
          bookId: book._id,
          lender: book.owner._id,
          borrower: user.data._id,
        },
      });
      // update the book availability to false

      console.log("ledger", ledger);
    } catch (e) {
      console.error(e);
    }
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Request Book
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
          Are you sure you want to request this book? Confirming will send an
          email to the owner
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleRequest()}>
            Request Book
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConfirmation;
