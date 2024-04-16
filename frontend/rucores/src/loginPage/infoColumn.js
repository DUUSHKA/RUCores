import PropTypes from "prop-types";
import React from "react";
import { Col } from "react-bootstrap";

function InfoColumn(props) {
  return (
    <Col
      lg={4}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <img
        src={props.imgSrc}
        className="bd-placeholder-img rounded-circle"
        alt="Placeholder"
        width="140"
        height="140"
      />
      <h2 className="text-center mt-3">{props.title}</h2>
      <p className="text-center mb-4">{props.content}</p>
      <p className="mt-auto">
        {/* <Button variant="secondary" href="#">
          View details &raquo;
        </Button> */}
      </p>
    </Col>
  );
}

InfoColumn.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
};

export default InfoColumn;
