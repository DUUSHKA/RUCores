import "bootstrap/dist/css/bootstrap.min.css";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import User from "../../../UserCalls";
import "./currentBalance.css";

function CurrentFacilityBalance(prop) {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [currentBalance, setCurrentBalance] = useState();

  /**
   * data for the Doughnut Chart
   */
  const data = {
    labels: ["Availible Balance"],
    datasets: [
      {
        label: "Balance Information",
        data: [currentBalance ? currentBalance : 0],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    if (prop.currentFacilityId) {
      const userApi = new User();
      userApi.getProviderAnalytics(prop.currentFacilityId).then((resp) => {
        setCurrentBalance(resp.monthlySummary.totalEarning);
        console.log(resp.monthlySummary.totalEarning);
      });
    }
  }, [prop.currentFacilityId]);

  return (
    <>
      <div className="Content">
        <div className="walletCardStyling">
          <h5>Balance Information:</h5>
          <Doughnut data={data}></Doughnut>
          <p className="facilityAvailBal">
            Available balance: {currentBalance} RU COINS
          </p>
        </div>
      </div>
    </>
  );
}

CurrentFacilityBalance.propTypes = {
  currentFacilityId: PropTypes.number,
  refreshBalance: PropTypes.bool,
};

export default CurrentFacilityBalance;
