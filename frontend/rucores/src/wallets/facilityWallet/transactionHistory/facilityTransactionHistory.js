/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Pagination from "react-bootstrap/Pagination";
import Tooltip from "react-bootstrap/Tooltip";
import Transaction from "../../../transactionCalls";
import "./transactionHistory.css";
function FacilityTransactionHistory(prop) {
  const [transactionData, setTransactionData] = useState([]);
  const [history, setTransactionHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const transactionAPI = new Transaction();

    transactionAPI
      .getTransactionsByFacilityId(prop.facilityID, 50, 0)
      .then((resp) => {
        console.log("GET TRANSACTIONS", resp);
        setTransactionData(resp);
      });
  }, [prop.facilityID]);

  useEffect(() => {
    if (transactionData && transactionData.length > 0) {
      setTransactionHistory(
        transactionData.map((item) => [
          `${item.transactionType} ${item.amountChanged * -1} RU Coins ${new Date(
            item.date,
          ).toLocaleString()}`,
          item,
        ]),
      );
    }
  }, [transactionData]);

  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  const currentTransactions = history.slice(startIndex, endIndex + 1);

  const transactionListItems = currentTransactions.map((transaction, index) => (
    <div key={index}>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={
          <Tooltip id="button-tooltip-2">{`${transaction[1].amountChanged * -1} RU Coins - ${transaction[1]?.facility?.name || "Purchase"} : ${transaction[1]?.eventDesription}`}</Tooltip>
        }
      >
        <ListGroup.Item className="historyListItem">
          {transaction[0]}
        </ListGroup.Item>
      </OverlayTrigger>
    </div>
  ));

  // Generate pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <>
      <div className="FacilitytransactionCardStyling">
        <h5>Transaction History</h5>
        <div>
          <ListGroup className="HistoryList" variant="flush">
            {transactionListItems}
          </ListGroup>
        </div>
        <div className="facilityhistoryPagination">
          <Pagination size="sm">{paginationItems}</Pagination>
        </div>
      </div>
    </>
  );
}

FacilityTransactionHistory.propTypes = {
  transactionHistoryData: PropTypes.shape({
    history: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        // Add other properties as needed
      }),
    ).isRequired,
  }).isRequired,
  refreshHistory: PropTypes.bool,
  facilityID: PropTypes.number,
};

export default FacilityTransactionHistory;
