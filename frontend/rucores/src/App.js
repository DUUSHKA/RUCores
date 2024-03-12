import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import FAQ from "./FAQ";
import AddFacility from "./addFacility/addFacility";
import Dashboard from "./dashBoard/Dashboard";
import CreateAccountPage from "./loginPage/createAccountPage/CreateAccountPage";
import Login from "./loginPage/login";
import NavBar from "./navBar/navBar";
import ScheduleFacility from "./schedule_facilities/schedule_facility";
import Wallet from "./wallet/wallet";
import ScheduledBookings from "./scheduledBookings/scheduledBookings";

function App() {
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
          path="/dashboard"
          element={
            <>
              <NavBar />
              <Dashboard />
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
          path="/FacilityInfo"
          element={
            <>
              <NavBar />
              <ScheduleFacility />
            </>
          }
        />
        <Route
          path="/schedule"
          element={
            <>
              <NavBar />
              <ScheduledBookings />
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
        <Route
          path="/CreateAccountPage"
          element={
            <>
              <CreateAccountPage />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
