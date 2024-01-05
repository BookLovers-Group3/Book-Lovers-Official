import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalConfirmation({ handleShow, handleClose, show }) {
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Request Book
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}>
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
          <Button variant="primary"> Request Book</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConfirmation;
