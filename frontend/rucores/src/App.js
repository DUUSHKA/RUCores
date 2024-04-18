import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import FAQ from "./FAQ";
import AccountManage from "./accountManage/accountManage";
import AddFacility from "./addFacility/addFacility";
import Dashboard from "./dashBoard/Dashboard";
import CreateAccountPage from "./loginPage/createAccountPage/CreateAccountPage";
import LoginCard from "./loginPage/login";
import LoginPage from "./loginPage/loginPage";
import NavBar from "./navBar/navBar";
import EditFacility from "./schedule_facilities/edit_facilities/editFacility";
import ScheduleFacility from "./schedule_facilities/schedule_facility";
import ScheduledBookingTitle from "./scheduledBookings/scheduleBookingTitle";
import ScheduledBookings from "./scheduledBookings/scheduledBookings";
import WalletManager from "./wallets/walletManager";

function App() {
  return (
    <Router>
      <Link to="/"></Link>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <LoginPage />
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
              <LoginCard />
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
          path="/editFacility/:facilityID"
          element={
            <>
              <NavBar />
              <EditFacility />
            </>
          }
        />
        <Route
          path="/schedule"
          element={
            <>
              <NavBar />
              <div className="scheduledBookingsContainer">
                <ScheduledBookingTitle />
                <ScheduledBookings />
              </div>
            </>
          }
        />
        <Route
          path="/wallet"
          element={
            <>
              <NavBar />
              <WalletManager />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <NavBar />
              <AccountManage className="manageAccount"></AccountManage>
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
