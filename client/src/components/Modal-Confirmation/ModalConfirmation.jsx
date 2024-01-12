import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@apollo/client";
import { OPEN_LEDGER, CLOSE_LEDGER } from "../../utils/mutations";
import Auth from "../../utils/auth";
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
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => handleReturn()}>
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
          <Button variant="secondary" onClick={handleClose}>
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
