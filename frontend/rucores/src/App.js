import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './loginPage/login';
import NavBar from './navBar/navBar';
import FAQ from './FAQ';
import Dashboard from './Dashboard';
import FacilityInfo from './Facility';

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
        <Route path="/home" element={
          <>
            <NavBar />
            <>
              <h1>Welcome to RU Cores Wallet</h1>
              <p>Manage your core facilities bookings and RU Coin transactions with ease.</p>
            </>
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
        <Route path="/dashboard" element={
          <>
            <NavBar />
            <Dashboard />
          </>} />
        <Route path="/FacilityInfo" element={
          <>
            <NavBar />
            <FacilityInfo />
          </>} />
        <Route path="/schedule" element={
          <>
            <NavBar />
          </>} />
          <Route path="/wallet" element={
          <>
            <NavBar />
          </>} />
          <Route path="/analytics" element={
          <>
            <NavBar />
          </>} />
          <Route path="/account" element={
          <>
            <NavBar />
          </>} />
          

      </Routes>

    </Router>
  );
}

export default App;
