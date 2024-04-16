import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function MultiColumnFeaturette() {
  return (
    <Container fluid>
      <hr className="featurette-divider" />
      <Container>
        <Row>
          <Col>
            <h2 className="featurette-heading fw-normal lh-1">
              First featurette heading.
              <span className="text-body-secondary">It’ll blow your mind.</span>
            </h2>
            <p className="lead">
              Some great placeholder content for the first featurette here.
              Imagine some exciting prose here.
            </p>
          </Col>
          <Col md="auto">
            <div style={{ paddingRight: "10px" }}>
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
                <rect
                  width="100%"
                  height="100%"
                  fill="var(--bs-secondary-bg)"
                />
                <text
                  x="50%"
                  y="50%"
                  fill="var(--bs-secondary-color)"
                  dy=".3em"
                >
                  500x500
                </text>
              </svg>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col md="auto">
            <div style={{ paddingRight: "10px" }}>
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
                <rect
                  width="100%"
                  height="100%"
                  fill="var(--bs-secondary-bg)"
                />
                <text
                  x="50%"
                  y="50%"
                  fill="var(--bs-secondary-color)"
                  dy=".3em"
                >
                  500x500
                </text>
              </svg>
            </div>
          </Col>
          <Col>
            <h2 className="featurette-heading fw-normal lh-1">
              First featurette heading.
              <span className="text-body-secondary">It’ll blow your mind.</span>
            </h2>
            <p className="lead">
              Some great placeholder content for the first featurette here.
              Imagine some exciting prose here.
            </p>
          </Col>
        </Row>
      </Container>
      <hr className="featurette-divider" />
    </Container>
  );
}

// MultiColumnFeaturette.propTypes = {
//     heading: PropTypes.string.isRequired,
//     subheading: PropTypes.string.isRequired,
//     text: PropTypes.string.isRequired,
// };

export default MultiColumnFeaturette;
