import React, { useEffect, useState } from "react";
import "./currentBalance.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";
import BookingCalls from "../../../BookingCalls";
import User from "../../../UserCalls";

function CurrentBalance(prop) {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [pendingBalance, setPendingBalance] = useState();
  const [currentBalance, setCurrentBalance] = useState();

  /**
   * data for the Doughnut Chart
   */
  const data = {
    labels: ["Pending Balance", "Availible Balance"],
    datasets: [
      {
        label: "Balance Information",
        data: [
          pendingBalance ? pendingBalance : 0,
          currentBalance ? currentBalance : 0,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const bookingAPI = new BookingCalls();
    const id = parseInt(window.sessionStorage.getItem("id"));
    bookingAPI.getAllFutureBookingsByUser(id).then((resp) => {
      let totalCost = 0;

      resp.forEach((obj) => {
        totalCost += obj.cost;
      });

      setPendingBalance(totalCost);
    });

    const UserCall = new User();
    UserCall.getUserByID(
      parseInt(window.sessionStorage.getItem("id"), 10),
    ).then((resp) => {
      setCurrentBalance(resp.balance);
    });
  }, [prop.refreshBalance]);

  return (
    <>
      <div className="Content">
        <div className="walletCardStyling">
          <h5>Balance Information:</h5>
          <Doughnut data={data}></Doughnut>
          <p className="pendingBalance">
            Pending Balance: {pendingBalance} RU COINS
          </p>
          <p>Available balance: {currentBalance} RU COINS</p>
        </div>
      </div>
    </>
  );
}

CurrentBalance.propTypes = {
  currentBalancedata: PropTypes.object,
  refreshBalance: PropTypes.bool,
};

export default CurrentBalance;
