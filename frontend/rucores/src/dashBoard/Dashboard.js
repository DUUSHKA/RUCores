import React from "react";
import "./Dashboard.css";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import WeeklyCard from "./weeklyCard/weeklyCard";
// import WeeklyCard from './weeklyCard/weeklyCard';

function Dashboard() {
  /**
   * sample transactionHistory Data
   */
  const transactionHistoryData = {
    history: [
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
    ],
  };

  /**
   * transactionList
   */
  const transactionListItems = transactionHistoryData.history.map(
    (transaction, index) => {
      if (index < 4) {
        return <ListGroup.Item key={index}>{transaction}</ListGroup.Item>;
      } else {
        return null;
      }
    },
  );

  const isProvider = window.sessionStorage.getItem("isProvider") === "true";

  return (
    <>
      <div className="dashboard">
        <h1 className="dashboardH1">Dashboard</h1>
        <div className="dashboard-sections">
          <section className="balance">
            <h2 className="dashBoardH2">RU Coin Balance</h2>
            <p>1000 RU Coins</p> {/* Placeholder value */}
            <Link to="/wallet">
              <Button variant="link">View Wallet</Button>
            </Link>
          </section>
          <section className="transactions">
            <h2 className="dashBoardH2">Recent Transactions</h2>
            <div>
              <ListGroup className="HistoryList" variant="flush">
                {transactionListItems}
              </ListGroup>
              <Link to="/wallet">
                <Button variant="link">View All Transactions</Button>
              </Link>
            </div>
          </section>
          {isProvider && (
            <section className="bookings">
              <h2 className="dashBoardH2">Your Facilities</h2>
              <ul>
                {/* Placeholder bookings*/}
                <li>Lab A - Chemistry </li>
                <li>Lab B - Biology </li>
              </ul>
            </section>
          )}

          {}
        </div>
      </div>
      <div className="weekCard">
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>MONDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            <WeeklyCard />
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>TUESDAY</h3>
          </div>
          <div className="WeeklyCardContent"></div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>WEDNESDAY</h3>
          </div>
          <div className="WeeklyCardContent"></div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>THURSDAY</h3>
          </div>
          <div className="WeeklyCardContent"></div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>FRIDAY</h3>
          </div>
          <div className="WeeklyCardContent"></div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>SATURDAY</h3>
          </div>
          <div className="WeeklyCardContent"></div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>SUNDAY</h3>
          </div>
          <div className="WeeklyCardContent"></div>
        </div>
      </div>
      <Link to="/dashboard">
        <Button>View More</Button>
      </Link>
    </>
  );
}

export default Dashboard;
