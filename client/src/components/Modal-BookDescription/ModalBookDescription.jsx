import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ModalBookDescription.scss";

function ModalBookDescription({ description, title, book, randomBook }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let modalTitle = "No title available";
  let modalDescription = "No book description available";
  let modalClassName = "custom-modal-container";

  if (randomBook) {
    modalTitle = randomBook.volumeInfo.title || modalTitle;
    modalDescription = randomBook.volumeInfo.description || modalDescription;
    modalClassName = " random-book-modal";
  } else if (book) {
    modalTitle = book.title || modalTitle;
    modalDescription = book.description || modalDescription;
    modalClassName = " book-modal";
  } else {
    modalTitle = title || modalTitle;
    modalDescription = description || modalDescription;
  }

  return (
    <>
      <Button className="btn-book-d" onClick={handleShow}>Book Description</Button>
      <Modal className={modalClassName} show={show} onHide={handleClose}>
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">{modalDescription}</Modal.Body>
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
