import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import SuccessFailureAlert from "../../SuccessFailureAlerts";
import User from "../../UserCalls";
import "./purchaseCoins.css";

function PurchaseCoins() {
  const [numOfCoins, setNumOfCoins] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  /**
   * set background color to red for login button
   */
  const buttonColor = {
    backgroundColor: "red",
    fontSize: "0.75rem",
  };

  const addBalance = () => {
    const UserID = parseInt(window.sessionStorage.getItem("id"), 10);
    console.log(parseInt(numOfCoins));
    const userAPI = new User();
    if (parseInt(numOfCoins)) {
      userAPI.addFundsToCurrUser(UserID, numOfCoins).then((resp) => {
        if (resp.id) {
          setShowSuccess(true);
        } else {
          setShowError(true);
        }
      });
    } else {
      setShowError(true);
    }
  };

  const onclose = () => {
    setShowSuccess(false);
    setShowError(false);
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
                onChange={(e) => setNumOfCoins(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="purchaseBtnPadding">
            <Button
              style={buttonColor}
              className="btn-xs"
              size="sm"
              onClick={addBalance}
            >
              Purchase
            </Button>
          </div>
          <SuccessFailureAlert
            variant={"success"}
            alertText={`added ${numOfCoins} RU coins to your balance!`}
            show={showSuccess}
            onClose={onclose}
          ></SuccessFailureAlert>
          <SuccessFailureAlert
            variant={"danger"}
            alertText={`Failed to add RU coins to your balance! Enter a valid number and try again or contact support!`}
            show={showError}
            onClose={onclose}
          ></SuccessFailureAlert>
        </div>
      </div>
    </>
  );
}

export default PurchaseCoins;
