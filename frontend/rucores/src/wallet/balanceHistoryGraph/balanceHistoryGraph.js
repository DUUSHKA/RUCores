import "bootstrap/dist/css/bootstrap.min.css";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Line } from "react-chartjs-2";
import User from "../../UserCalls";
import "./balanceHistoryGraph.css";
function BalanceHistoryGraph(props) {
  /**
   * data values for graph
   */
  const dataValues = props.balanceHistoryGraphData.historyData;

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

  const [userAnalytics, setUserAnalytics] = useState();
  const [spendingData, setSpendingData] = useState();
  const [timePerMonth, setTimePerMonth] = useState();
  const [graphData, setGraphData] = useState({
    labels,
    datasets: [
      {
        label: "Spending History",
        data: userAnalytics ? userAnalytics : dataValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  });
  /**
   * graph key position
   */
  const keyPosition = "bottom";
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: keyPosition,
      },
      title: {
        display: true,
        text: "RU Coins Spent/Month",
      },
    },
    maintainAspectRatio: false,
    height: 800,
    width: 600,
  });

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

  useEffect(() => {
    const userApi = new User();
    userApi.getUserAnalytics().then((resp) => {
      setUserAnalytics(resp);
      console.log(resp);
    });
  }, []);

  useEffect(() => {
    if (userAnalytics) {
      setSpendingData(userAnalytics.monthlyData.map((item) => item.spending));
      setTimePerMonth(userAnalytics.monthlyData.map((item) => item.time));
      console.log(spendingData);
      console.log(timePerMonth);
    }
  }, [userAnalytics]);

  useEffect(() => {
    setGraphData({
      labels,
      datasets: [
        {
          label: "Spending History",
          data: spendingData ? spendingData : dataValues,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
      ],
    });
    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: keyPosition,
        },
        title: {
          display: true,
          text: "RU Coins Spent/Month",
        },
      },
      maintainAspectRatio: false,
      height: 800,
      width: 600,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "RU Coins", // Label for y-axis
          },
        },
      },
    });
  }, [spendingData]);

  /**
   * sets balance History data
   */
  const balanceHistoryData = () => {
    setGraphData({
      labels,
      datasets: [
        {
          label: "Spending History",
          data: spendingData ? spendingData : dataValues,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
      ],
    });
    options.plugins.title = {
      display: true,
      text: "RU Coins Spent/Month",
    };
    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: keyPosition,
        },
        title: {
          display: true,
          text: "RU Coins Spent/Month",
        },
      },
      maintainAspectRatio: false,
      height: 800,
      width: 600,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "RU Coins", // Label for y-axis
          },
        },
      },
    });
  };

  /**
   * sets balance History data
   */
  const timePerMonthData = () => {
    setGraphData({
      labels,
      datasets: [
        {
          label: "Time Spent/Month in Facilities",
          data: timePerMonth ? timePerMonth : dataValues,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
      ],
    });
    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: keyPosition,
        },
        title: {
          display: true,
          text: "Time Spent/Month in Facilities",
        },
      },
      maintainAspectRatio: false,
      height: 800,
      width: 600,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Minutes", // Label for y-axis
          },
        },
      },
    });
  };

  return (
    <>
      <div className="walletGraphStyling">
        <div className="graphTabs">
          <Button onClick={balanceHistoryData}>Balance History</Button>
          <Button onClick={timePerMonthData}>Time/month History</Button>
        </div>

        <Line options={options} data={graphData} />
      </div>
    </>
  );
}

BalanceHistoryGraph.propTypes = {
  balanceHistoryGraphData: PropTypes.object,
};

export default BalanceHistoryGraph;
