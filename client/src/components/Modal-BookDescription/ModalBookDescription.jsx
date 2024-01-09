import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

function ModalBookDescription({ description, title, book, randomBook }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let modalTitle = "No title available";
  let modalDescription = "No book description available";

  if (randomBook) {
    modalTitle = randomBook.volumeInfo.title || modalTitle;
    modalDescription = randomBook.volumeInfo.description || modalDescription;
  } else {
    modalTitle = title || modalTitle;
    modalDescription = description || modalDescription;
  }

  if (book) {
    modalTitle = book.title || modalTitle;
    modalDescription = book.description || modalDescription;
  } else {
    modalTitle = title || modalTitle;
    modalDescription = description || modalDescription;
  }

  return (
    <>
      <Button onClick={handleShow}>Book Description</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalBookDescription;
