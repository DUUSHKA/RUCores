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
        <img
          className="featurette-image img-fluid mx-auto"
          src={props.imageSrc}
          alt={props.imageAlt}
          width="500"
          height="500"
        />
      </Col>
    </Row>
  );
}

Featurette.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
};

export default Featurette;
