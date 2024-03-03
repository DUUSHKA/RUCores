import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homePage">
      <header className="navBar">
        <h1>RU Cores Wallet</h1>
        <nav>
          <ul>
            <li>
              <Link to="/schedule">Schedule</Link>
            </li>
            <li>
              <Link to="/wallet">Wallet</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="content">
        <h2>Welcome to RU Cores Wallet</h2>
        <p>
          Your centralized platform for managing core facilities with RU Coins.
        </p>
      </main>
    </div>
  );
}

export default HomePage;
