import React from "react";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import "../assets/Logo-Rutgers-University.jpg";
import RULogo from "../assets/Logo-Rutgers-University.jpg";
import LabWorkers from "../assets/labWork.jpg";
import Wallet from "../assets/wallet.jpg";

function CarouselLogin() {
  return (
    <>
      <Carousel>
        <Carousel.Item className="carousel-item">
          <img className="d-block w-100" src={Wallet} alt="First slide" />
          <Carousel.Caption>
            <h3>State of the Art Equipment at Rutgers Facilities</h3>
            <p>Schedule time to work with top equipment.</p>
            <Button variant="primary" size="lg" href="#">
              Sign up today
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carousel-item">
          <img className="d-block w-100" src={LabWorkers} alt="Second slide" />
          <Carousel.Caption>
            <h3>Another example headline.</h3>
            <p>
              Some representative placeholder content for the second slide of
              the carousel.
            </p>
            <Button variant="primary" size="lg" href="#">
              Learn more
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carousel-item">
          <img className="d-block w-100" src={RULogo} alt="Third slide" />
          <Carousel.Caption>
            <h3>One more for good measure.</h3>
            <p>
              Some representative placeholder content for the third slide of
              this carousel.
            </p>
            <Button variant="primary" size="lg" href="#">
              Browse gallery
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default CarouselLogin;
