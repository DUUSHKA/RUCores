import React from "react";
import "./navBar.css";
import { Link } from "react-router-dom";
import logo from "../logo.svg";

function NavBar() {
  return (
      <div className="App">
        <nav className="App-nav">
          <img src={logo} alt="RU Cores Wallet Logo" className="App-logo" />
          <ul>
            <li><Link to="/login"></Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li> {}
            <li><Link to="/schedule">Scheduled</Link></li>
            <li><Link to="/wallet">Wallet</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/FacilityInfo">Schedule Facilities</Link></li>
            <li><Link to="/AddFacility">Add Facility</Link></li>
            <li><Link to="/">Log Out</Link></li>
          </ul>
        </nav>
        <main className="App-main">

        </main>
      </div>

  );
}

export default NavBar;
