import React from "react";
import Row from "react-bootstrap/Row";
import InfoColumn from "./infoColumn";

function MultiColumnInfo() {
  return (
    <Row className="mt-4">
      <InfoColumn
        title="Heading"
        content="Some representative placeholder content for the three columns of text below the carousel. This is the first column."
      />
      <InfoColumn
        title="Heading"
        content="Another exciting bit of representative placeholder content. This time, we've moved on to the second column."
      />
      <InfoColumn
        title="Heading"
        content="And lastly this, the third column of representative placeholder content."
      />
    </Row>
  );
}

export default MultiColumnInfo;
