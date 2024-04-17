import React from "react";
import Carousel from "react-bootstrap/Carousel";
import bitcoin from "../assets/bitcoin.jpg";
import LabWorkers from "../assets/labWork.jpg";
import "../assets/Logo-Rutgers-University.jpg";
import rutgersHealth from "../assets/rutgersHealth.jpg";

function CarouselLogin() {
  return (
    <>
      <Carousel variant="dark" style={{ margin: "0px 0px 20px 0px" }}>
        <Carousel.Item className="carousel-item">
          <img
            className="d-block w-100 opaque-image"
            src={bitcoin}
            alt="First slide"
          />
          <Carousel.Caption className="Centered-caption login-font-Display-Bold">
            <p>RU Cores Wallet</p>
            <p>Using Virtual Currency to schedule Research!</p>
            <div style={{ minHeight: "110px" }}></div>
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
          <Carousel.Caption className="Centered-caption login-font-Display-Bold">
            <p>State of the art Research Facilities</p>
            <p>Use Rutgers RU Coins to use Professional Equipment</p>
            <div style={{ minHeight: "110px" }}></div>
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
          <Carousel.Caption className="Centered-caption login-font-Display-Bold">
            <p>Open To Faculty and Graduates</p>
            <p>Rutgers Research Facilites for our Members</p>
            <div style={{ minHeight: "110px" }}></div>
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
