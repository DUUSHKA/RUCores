import React from "react";
import Carousel from "react-bootstrap/Carousel";
import LabWorkers from "../assets/labWork.jpg";
import "../assets/Logo-Rutgers-University.jpg";
import bitcoin from "../assets/RUCoinBannerImage.jpg";
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
          <Carousel.Caption className="Centered-caption ">
            <p className="login-font-Display-Caption-Bold">RU Cores Wallet</p>
            <p className="login-font-card-Text">
              Using Virtual Currency to schedule Research!
            </p>
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
          <Carousel.Caption className="Centered-caption ">
            <p className="login-font-Display-Caption-Bold">
              State of the Art Research Facilities{" "}
            </p>
            <p className="login-font-card-Text">
              Use Rutgers RU Coins to use Professional Equipment
            </p>
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
          <Carousel.Caption className="Centered-caption">
            <p className="login-font-Display-Caption-Bold">
              Open To Faculty and Graduates
            </p>
            <p className="login-font-card-Text">
              Rutgers Research Facilites for our Members
            </p>
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
