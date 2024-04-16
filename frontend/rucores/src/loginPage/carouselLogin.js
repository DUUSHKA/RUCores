import React from "react";
import Carousel from "react-bootstrap/Carousel";
import bitcoin from "../assets/bitcoin.jpg";
import LabWorkers from "../assets/labWork.jpg";
import "../assets/Logo-Rutgers-University.jpg";
import rutgersHealth from "../assets/rutgersHealth.jpg";

function CarouselLogin() {
  return (
    <>
      <Carousel>
        <Carousel.Item className="carousel-item">
          <img
            className="d-block w-100 opaque-image"
            src={bitcoin}
            alt="First slide"
          />
          <Carousel.Caption className="Centered-caption">
            <h3>RU Cores Wallet</h3>
            <p>Using virtual currency to schedule research!</p>
            <div style={{ minHeight: "180px" }}></div>
            {/* <Button variant="primary" size="lg" href="#">
              Sign up today
            </Button> */}
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carousel-item">
          <img
            className="d-block w-100 opaque-image"
            src={LabWorkers}
            alt="Second slide"
          />
          <Carousel.Caption className="Centered-caption">
            <h3>State of the art Research Facilities</h3>
            <p>
              Use Rutgers RU Coins to schedule time with professional equipment
            </p>
            <div style={{ minHeight: "180px" }}></div>
            {/* <Button variant="primary" size="lg" href="#">
              Learn more
            </Button> */}
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carousel-item">
          <img
            className="d-block w-100 opaque-image"
            src={rutgersHealth}
            alt="Third slide"
          />
          <Carousel.Caption className="Centered-caption">
            <h3>Open To Faculty and Graduates</h3>
            <p>
              Rutgers University is proud to offer this service to our members
            </p>
            <div style={{ minHeight: "180px" }}></div>
            {/* <Button variant="primary" size="lg" href="#">
              Browse gallery
            </Button> */}
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default CarouselLogin;
