import React from "react";
import { Col, Container, Row } from "react-bootstrap";

// eslint-disable-next-line react/prop-types, no-unused-vars
function MultiColumnFeaturette({ clickedSection }) {
  return (
    <Container fluid>
      <hr className="featurette-divider" />
      <section id="coins">
        <Container>
          <Row>
            <Col>
              <h2 className="featurette-heading fw-normal lh-1">
                Rutgers First Virtual Currency - RU Coins.
                <span className="text-body-secondary">
                  Where Rutgers meets the Blockchain.
                </span>
              </h2>
              <p className="lead">
                RU Coins allow for faster and more secure transactions between
                Rutgers faculty and students. Get research grants converted or
                be rewarded for school spirit and activity participation.
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
      </section>
      <section id="about">
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
                RU Cores Facility - {}
                <span className="text-body-secondary">Our Mission</span>
              </h2>
              <p className="lead">
                Our mission is to create a centralized area in order to allow
                students and faculty to be able to quickly access and use
                Rutgers Core Facilities with ease! We want students to continue
                to stay inspired and work towards innovation!
              </p>
            </Col>
          </Row>
        </Container>
      </section>
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
