import React from "react";
import "./purchaseCoins.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

function PurchaseCoins() {
  /**
   * set background color to red for login button
   */
  const buttonColor = {
    backgroundColor: "red",
    fontSize: "0.75rem",
  };

  return (
    <>
      <div className="outerContainer">
        <div className="purchase">
          <h5>Purchase RU Coins</h5>
          <div className="purchaseInputs">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">
                RU Coins
              </InputGroup.Text>
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
              />
            </InputGroup>
          </div>
          <div className="purchaseBtnPadding">
            <Button style={buttonColor} className="btn-xs" size="sm">
              Purchase
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchaseCoins;
