import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.svg";
import FAQ from "./FAQ";
import Dashboard from "./Dashboard";
import FacilityInfo from "./Facility";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <img src={logo} alt="RU Cores Wallet Logo" className="App-logo" />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>{" "}
            {}
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>{" "}
            {}
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
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/FacilityInfo">FacilityInfo</Link>
            </li>
          </ul>
        </nav>
        <main className="App-main">
          <Routes>
            <Route path="/faq" element={<FAQ />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/FacilityInfo" element={<FacilityInfo />} />
            {}
            {}
            <Route
              path="/"
              element={
                <>
                  <h1>Welcome to RU Cores Wallet</h1>
                  <p>
                    Manage your core facilities bookings and RU Coin
                    transactions with ease.
                  </p>
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
