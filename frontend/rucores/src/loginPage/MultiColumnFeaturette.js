import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import image2 from "../assets/RUCoin.jpg";
import image1 from "../assets/RutgersBlackandRedLogo.png";

// eslint-disable-next-line react/prop-types, no-unused-vars
function MultiColumnFeaturette({ clickedSection }) {
  return (
    <Container fluid>
      <hr className="featurette-divider" />
      <section id="coins">
        <Container>
          <Row>
            <Col>
              <h2 className="login-font-Display-Header-Featurette-Bold">
                Rutgers First Virtual Currency: RU Coins -
                <span className="text-body-secondary login-font-Display-Header-Featurette-Bold">
                  {" Where Rutgers meets the Blockchain."}
                </span>
              </h2>
              <p className="lead login-font-Text">
                The goal for RU Coins is to build into a private blockchain. RU
                Coins allow for faster and more secure transactions between
                Rutgers faculty and students. Get research grants converted or
                be rewarded for school spirit and activity participation.
              </p>
            </Col>
            <Col md="auto">
              <div style={{ paddingRight: "10px" }}>
                <img
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  src={image2}
                  alt="Descriptive text for the second image"
                  width="500"
                  height="500"
                />
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
                <img
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  src={image1}
                  alt="Descriptive text for the first image"
                  width="500"
                  height="500"
                />
              </div>
            </Col>
            <Col>
              <h2 className="login-font-Display-Header-Featurette-Bold">
                RU Cores Facility - {}
                <span className="text-body-secondary login-font-Display-Header-Featurette-Bold">
                  Our Mission
                </span>
              </h2>
              <p className="lead login-font-Text">
                Our mission is to create a centralized area in order to allow
                students and faculty to be able to quickly access and use
                Rutgers Core Facilities with ease! We want students to continue
                to stay inspired and work towards innovation!
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
}

export default MultiColumnFeaturette;
