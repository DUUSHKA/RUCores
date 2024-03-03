import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import FAQ from "./FAQ";
import FacilityInfo from "./Facility";
import AddFacility from "./addFacility/addFacility";
import Login from "./loginPage/login";
import NavBar from "./navBar/navBar";
import Wallet from "./wallet/wallet";

function App() {
  const facilityDetails = {
    name: "Lab A - Chemistry",
    equipment: ["Microscopes", "Bunsen Burners", "Chemical Reactors"],
    operatingHours: "9 AM - 5 PM",
    cost: "50 RU Coins per hour",
    description:
      "Lab A specializes in chemistry research and offers a wide range of equipment for various experiments.",
  };

  return (
    <Router>
      <Link to="/"></Link>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <NavBar />
              <>
                <h1>Welcome to RU Cores Wallet</h1>
                <p>
                  Manage your core facilities bookings and RU Coin transactions
                  with ease.
                </p>
              </>
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <NavBar />
              <Login />
            </>
          }
        />
        <Route
          path="/faq"
          element={
            <>
              <NavBar />
              <FAQ />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <NavBar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/FacilityInfo"
          element={
            <>
              <NavBar />
              <FacilityInfo facilityDetails={facilityDetails} />
            </>
          }
        />
        <Route
          path="/schedule"
          element={
            <>
              <NavBar />
            </>
          }
        />
        <Route
          path="/wallet"
          element={
            <>
              <NavBar />
              <Wallet />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <NavBar />
            </>
          }
        />
        <Route
          path="/addFacility"
          element={
            <>
              <NavBar />
              <AddFacility />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
