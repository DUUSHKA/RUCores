import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LoginCard from "./login"; // Import the LoginCard component
import "./login.css";

function NavBarLogin() {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <header data-bs-theme="dark">
        <Navbar bg="dark" variant="dark" expand="md" fixed="top">
          <Container fluid>
            <Navbar.Brand href="#">RU Cores Wallet</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarCollapse" />
            <Navbar.Collapse id="navbarCollapse">
              <Nav className="me-auto mb-2 mb-md-0">
                <Nav.Link href="#">Features</Nav.Link>
                <Nav.Link href="#">Coins</Nav.Link>
                <Nav.Link href="#">About Us</Nav.Link>
                <Nav.Link onClick={handleShow}>Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {showModal && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Login to RUCores Wallet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoginCard />
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
    </>
  );
}

export default NavBarLogin;
