import React from "react";
import Row from "react-bootstrap/Row";
import InfoColumn from "./infoColumn";

function MultiColumnInfo() {
  return (
    <Row className="mt-4">
      <InfoColumn
        title="Professional Equipment"
        content="Use RU Coins to access the plethora of Rutgers facility equipment. State of the art technology is at your fingertips!"
      />
      <InfoColumn
        title="Register as A Provider"
        content="Are you a Rutgers faculty member? Register as a provider to manage facilities for other researchers!"
      />
      <InfoColumn
        title="Reserve Your Spot"
        content="Make booking in advanced for your research group to never miss the chance to use the equipment you need!"
      />
    </Row>
  );
}

export default MultiColumnInfo;
