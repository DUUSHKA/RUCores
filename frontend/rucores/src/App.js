import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './loginPage/login';
import NavBar from './navBar/navBar';
import FAQ from './FAQ';
import Dashboard from './dashBoard/Dashboard';
import Wallet from './wallet/wallet';
import AddFacility from './addFacility/addFacility';
import CreateAccountPage from './loginPage/createAccountPage/CreateAccountPage';
import ScheduleFacility from './schedule_facilities/schedule_facility';

function App() {




  return (
    <Router>
      <Link to="/"></Link>

      <Routes>
        <Route path="/" element={
          <>
            <Login />
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <NavBar />
            <Dashboard />
          </>
        } />
        <Route path="/login" element={
          <>
            <NavBar />
            <Login />
          </>
        } />
        <Route path="/faq" element={
          <>
            <NavBar />
            <FAQ />
          </>
        } />
        <Route path="/FacilityInfo" element={
          <>
            <NavBar />
            <ScheduleFacility />
          </>} />
        <Route path="/schedule" element={
          <>
            <NavBar />
          </>} />
          <Route path="/wallet" element={
          <>
            <NavBar />
            <Wallet />
          </>} />
          <Route path="/account" element={
          <>
            <NavBar />
          </>} />
          <Route path="/addFacility" element={
          <>
            <NavBar />
            <AddFacility />
          </>} />
          <Route path="/CreateAccountPage" element={
          <>
            
            <CreateAccountPage />
          </>} />

      </Routes>
    </Router>
  );
}

export default App;
