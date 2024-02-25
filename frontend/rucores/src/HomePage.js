import React from "react";
import "./HomePage.css"; // Link to the CSS file for styling

function HomePage() {
  return (
    <div className="homePage">
      <header className="navBar">
        <h1>RU Cores Wallet</h1>
        <nav>
          <ul>
            <li>
              <a href="/schedule">Schedule</a>
            </li>
            <li>
              <a href="/wallet">Wallet</a>
            </li>
            <li>
              <a href="/analytics">Analytics</a>
            </li>
            <li>
              <a href="/account">Account</a>
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
