import PropTypes from "prop-types";
import React from "react";
import { Col, Row } from "react-bootstrap";

function Featurette(props) {
  return (
    <Row className="featurette">
      <Col md={7}>
        <h2 className="featurette-heading fw-normal lh-1">
          {props.heading}
          <span className="text-body-secondary">{props.subheading}</span>
        </h2>
        <p className="lead">{props.text}</p>
      </Col>
      <Col md={5}>
        <svg
          className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
          width="500"
          height="500"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder: 500x500"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>Placeholder</title>
          <rect width="100%" height="100%" fill="var(--bs-secondary-bg)" />
          <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">
            500x500
          </text>
        </svg>
      </Col>
    </Row>
  );
}

Featurette.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
export default Featurette;
