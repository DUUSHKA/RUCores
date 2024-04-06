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
import User from "../../../UserCalls";
import "./balanceHistoryGraph.css";
import BookingCalls from "../../../BookingCalls";
function FacilityBalanceHistoryGraph(props) {
  /**
   * data values for graph (random, shown for loading)
   */
  const dataValues = {
    historyData: [0, 23, 14, 56, 75, 31, 56, 34, 12, 56, 78, 100],
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

  const [facilityAnalytics, setFacilityAnalytics] = useState();
  const [spendingData, setSpendingData] = useState();
  const [timePerMonth, setTimePerMonth] = useState();

  const calculateTotalBookingTimeByMonth = (bookings) => {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Initialize an array with 12 zeros, one for each month
    const totalHoursPerMonth = new Array(12).fill(0);

    // Filter bookings for the current year
    const bookingsThisYear = bookings.filter((booking) => {
      const start = new Date(booking.startDateTime);
      return start.getFullYear() === currentYear;
    });

    bookingsThisYear.forEach((booking) => {
      const start = new Date(booking.startDateTime);
      const end = new Date(booking.endDateTime);

      // Calculate the duration in hours
      const duration = (end - start) / (1000 * 60 * 60);

      // Assuming bookings and the system are in the same timezone and
      // ignoring edge cases where bookings might span multiple months
      const month = start.getMonth(); // getMonth() is 0-indexed, January is 0

      totalHoursPerMonth[month] += duration;
    });

    return totalHoursPerMonth;
  };

  const [graphData, setGraphData] = useState({
    labels,
    datasets: [
      {
        label: "RU Coins",
        data: facilityAnalytics ? facilityAnalytics : dataValues,
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
    userApi.getProviderAnalytics(props.facilityID).then((resp) => {
      setFacilityAnalytics(resp);
    });
    const BookingApi = new BookingCalls();
    BookingApi.getAllFutureBookingsByFacility(props.facilityID).then(
      (resp1) => {
        BookingApi.getAllPastBookingsByFacility(props.facilityID).then(
          (resp) => {
            const allBookings = resp.concat(resp1);
            setTimePerMonth(calculateTotalBookingTimeByMonth(allBookings));
          },
        );
      },
    );
  }, [props.facilityID]);

  useEffect(() => {
    if (facilityAnalytics) {
      setSpendingData(
        facilityAnalytics.monthlyData.map((item) => item.totalBooked),
      );
    }
  }, [facilityAnalytics]);

  useEffect(() => {
    setGraphData({
      labels,
      datasets: [
        {
          label: "RU Coins",
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
          label: "RU Coins",
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
          label: "Time Spent/Month in Facility",
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
          text: "Time Spent/Month in Facility",
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
            text: "Hours", // Label for y-axis
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

FacilityBalanceHistoryGraph.propTypes = {
  facilityID: PropTypes.number,
};

export default FacilityBalanceHistoryGraph;
