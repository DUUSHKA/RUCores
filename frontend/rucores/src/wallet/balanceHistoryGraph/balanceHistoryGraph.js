import React from "react";
import "./balanceHistoryGraph.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

function BalanceHistoryGraph(props) {
  /**
   * chart renderer
   */
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  /**
   * graph key position
   */
  const keyPosition = "bottom";

  /**
   * graph options
   */
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: keyPosition,
      },
      title: {
        display: true,
        text: "Wallet Balance History",
      },
    },
    maintainAspectRatio: false, // Add this line to allow changing the aspect ratio
    height: 800, // Set the desired height in pixels
    width: 600,
  };

  /**
   * axis labels
   */
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /**
   * data values for graph
   */
  const dataValues = props.balanceHistoryGraphData.historyData;

  /**
   * graph data
   */
  const data = {
    labels,
    datasets: [
      {
        label: "Spending History",
        data: dataValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <>
      <div className="walletGraphStyling">
        <Line options={options} data={data} />
      </div>
    </>
  );
}

BalanceHistoryGraph.propTypes = {
  balanceHistoryGraphData: PropTypes.object,
};

export default BalanceHistoryGraph;
