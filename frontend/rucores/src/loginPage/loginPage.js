import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import CarouselLogin from "./carouselLogin";
import "./login.css";
import MultiColumnFeaturette from "./MultiColumnFeaturette";
import MultiColumnInfo from "./MultiColumnInfo";
import NavBarLogin from "./navBarLogin";

function LoginPage() {
  const [clickedSection, setClickedSection] = useState(null);
  //   const openModal = () => {
  //     setShowModal(true);
  //   };

  const handleSectionClick = (sectionId) => {
    setClickedSection(sectionId);
  };
  //   const buttonColor = {
  //     backgroundColor: "red",
  //   };
  // const OpenModal = async () => {
  //     navigate("/dashboard");
  // };
  /**
   *  rutgers logo for login page
   */
  // eslint-disable-next-line no-undef
  //const RULogo = require("../assets/Logo-Rutgers-University.jpg");
  // eslint-disable-next-line no-undef
  //const workers = require("../assets/labWorkers.jpg");
  // eslint-disable-next-line no-undef
  //const wallet = require("../assets/wallet.jpg");

  return (
    <>
      <div className="page-background">
        <NavBarLogin onSectionClick={handleSectionClick} />
        <main>
          <CarouselLogin />

          <section id="features" style={{ margin: "0px 20px" }}>
            <MultiColumnInfo />
          </section>
          <MultiColumnFeaturette clickedSection={clickedSection} />
        </main>
      </div>
    </>
  );
}

export default LoginPage;
