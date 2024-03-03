import React, { useState } from "react";
import "./transactionHistory.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";
import PropTypes from "prop-types";

function TransactionHistory(props) {
  const itemsPerPage = 4; // Adjust the number of items per page as needed
  const [currentPage, setCurrentPage] = useState(1);

  const history = props.transactionHistoryData.history;
  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  // Extract the transactions for the current page
  const currentTransactions = history.slice(startIndex, endIndex + 1);

  // Generate the list items for the current page
  const transactionListItems = currentTransactions.map((transaction, index) => (
    <ListGroup.Item key={index}>{transaction}</ListGroup.Item>
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
      <div className="transactionCardStyling">
        <h5>Transaction History</h5>
        <div>
          <ListGroup className="HistoryList" variant="flush">
            {transactionListItems}
          </ListGroup>
        </div>
        <div className="historyPagination">
          <Pagination size="sm">{paginationItems}</Pagination>
        </div>
      </div>
    </>
  );
}

TransactionHistory.propTypes = {
  transactionHistoryData: PropTypes.shape({
    history: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        // Add other properties as needed
      }),
    ).isRequired,
  }).isRequired,
};

export default TransactionHistory;
