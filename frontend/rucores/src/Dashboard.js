import React from 'react';
import './Dashboard.css'; 

function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className='dashboardH1'>Dashboard</h1>
      <div className="dashboard-sections">
        <section className="balance">
          <h2 className='dashBoardH2'>RU Coin Balance</h2>
          <p>1000 RU Coins</p> {/* Placeholder value */}
        </section>
        <section className="bookings">
          <h2 className='dashBoardH2'>Upcoming Bookings</h2>
          <ul>
            {/* Placeholder bookings*/}
            <li>Lab A - Chemistry - October 10, 2024</li>
            <li>Lab B - Biology - October 12, 2024</li>
          </ul>
        </section>
        <section className="transactions">
          <h2 className='dashBoardH2'>Recent Transactions</h2>
          <ul>
            {/* Placeholder transactions*/}
            <li>+200 RU Coins - Grant Award - October 5, 2024</li>
            <li>-50 RU Coins - Lab A Booking - October 5, 2024</li>
          </ul>
        </section>
        {}
      </div>
    </div>
  );
}

export default Dashboard;
