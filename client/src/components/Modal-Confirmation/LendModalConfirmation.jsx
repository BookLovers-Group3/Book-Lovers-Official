import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@apollo/client";
import { LEND_BOOK } from "../../utils/mutations";
import Auth from "../../utils/auth";
import {
  lendingBookId,
  getLendBookId,
  removeLendingBookId,
} from "../../utils/localStorage";

function LendModalConfirmation({
  handleShow,
  handleClose,
  show,
  book,
  books,
  lendBookIds,
  setLendBookIds,
}) {
  // sets up mutation to add book to lending list
  const [
    addBooksToLend,
    { loading: lendBookLoading, data: lendBookData, error: lendBookError },
  ] = useMutation(LEND_BOOK, {
    refetchQueries: ["me"],
  });

  // get the book id from local storage and find the book then add the book to the lending list
  const handleRequest = async () => {
    const lendBookId = getLendBookId();
    const bookToLend = books.find((book) => book.googleBookId === lendBookId);
    handleClose();
    try {
      const response = await addBooksToLend({
        variables: { book: bookToLend },
      });
      removeLendingBookId();
      setLendBookIds((lendBookIds) => [
        ...lendBookIds,
        bookToLend.googleBookId,
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  // when click on add to lend list, save the book google id into local storage
  const handleAddToLend = async () => {
    handleShow();
    lendingBookId(book.googleBookId);
  };

  return (
    <>
      <Button
        variant="primary"
        disabled={lendBookIds?.some(
          (lendingBookId) => lendingBookId === book.googleBookId
        )}
        onClick={() => {
          handleAddToLend();
        }}
      >
        {lendBookIds?.some(
          (lendingBookId) => lendingBookId === book.googleBookId
        )
          ? "Added"
          : "Add to Lending List"}
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
          You are about to share this book with the rest of the book lovers.
          Please confirm
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleRequest()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LendModalConfirmation;
