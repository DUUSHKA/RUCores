import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import LoginCard from "./login";
import "./login.css";

function LoginPage() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const buttonColor = {
    backgroundColor: "red",
  };
  // const OpenModal = async () => {
  //     navigate("/dashboard");
  // };
  /**
   *  rutgers logo for login page
   */
  // eslint-disable-next-line no-undef
  //const RULogo = require("../assets/Logo-Rutgers-University.jpg");
  // eslint-disable-next-line no-undef
  const workers = require("../assets/labWorkers.jpg");
  // eslint-disable-next-line no-undef
  const wallet = require("../assets/wallet.jpg");

  return (
    <>
      <div className="container">
        <div className="left">
          <img src={workers} alt="Large Image"></img>
        </div>
        <div className="right">
          <h1 className="title">RUCores Wallet</h1>
          <img src={wallet} alt="Small Image"></img>
          <p className="slogan">
            Explore Facilities and Schedule Research Time Using Your RU Coins
          </p>
          <button style={buttonColor} onClick={openModal}>
            Login Now!
          </button>
        </div>
      </div>

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

export default LoginPage;
