import React from "react";
import Row from "react-bootstrap/Row";
import image3 from "../assets/calendar.jpeg";
import image2 from "../assets/newWallet.png";
import image1 from "../assets/microscope.jpeg";
import InfoColumn from "./infoColumn";

function MultiColumnInfo() {
  return (
    <Row className="mt-4 ">
      <InfoColumn
        title="Professional Equipment"
        content="Use RU Coins to access the plethora of Rutgers facility equipment. State of the art technology is at your fingertips!"
        imgSrc={image1}
      />
      <InfoColumn
        title="Register as A Provider"
        content="Are you a Rutgers faculty member? Collect RU Coins by registering as a provider to manage facilities for other researchers!"
        imgSrc={image2}
      />
      <InfoColumn
        title="Reserve Your Spot"
        content="Make booking in advanced for your research group! Recover analytics to see your spending behavior!"
        imgSrc={image3}
      />
    </Row>
  );
}

export default MultiColumnInfo;
