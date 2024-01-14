import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@apollo/client";
import { LEND_BOOK } from "../../utils/mutations";

import { useState } from "react";

function LendModalConfirmation({ book, lendBookIds, setLendBookIds }) {
  //define modal state and function to show and close
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // sets up mutation to add book to lending list
  const [
    addBooksToLend,
    { loading: lendBookLoading, data: lendBookData, error: lendBookError },
  ] = useMutation(LEND_BOOK, {
    refetchQueries: ["me"],
  });

  // get the book id from local storage and find the book then add the book to the lending list
  const handleConfirm = async () => {
    const bookToLend = book;
    handleClose();
    try {
      const response = await addBooksToLend({
        variables: { book: bookToLend },
      });
      setLendBookIds((lendBookIds) => [
        ...lendBookIds,
        bookToLend.googleBookId,
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  // if didnt confirm, then close modal and remove the book id from localstorage
  const handleCloseBtn = () => {
    handleClose();
  };

  // when click on add to lend list, save the book google id into local storage
  const handleAddToLend = () => {
    handleShow();
  };

  return (
    <>
      <button className="return-book-button"
        variant="primary"
        disabled={lendBookIds?.some(
          (lendingBookId) => lendingBookId === book.googleBookId
        )}
        onClick={() => {
          handleAddToLend();
        }}>
        {lendBookIds?.some(
          (lendingBookId) => lendingBookId === book.googleBookId
        )
          ? "Added"
          : "Add to Lending List"}
      </button>

      <Modal className = "confirmation-modal"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        constainer={null}>
        <Modal.Header>
          <Modal.Title className="modal-title">Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          Please confirm that you have a physical copy of this book and that you
          are ready to share this book with the rest of the book lovers.
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

export default LendModalConfirmation;
