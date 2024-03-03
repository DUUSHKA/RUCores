import React from "react";
import "./wallet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CurrentBalance from "./currentBalance/currentBalance";
import BalanceHistoryGraph from "./balanceHistoryGraph/balanceHistoryGraph";
import PurchaseCoins from "./purchaseCoins/purchaseCoins";
import TransactionHistory from "./transactionHistory/transactionHistory";

/**
 *
 * wallet page- contains current balance, analytics
 *
 * @returns none
 */
function Wallet() {
  /**
   * data needed for current balance
   */
  const currentBalancedata = {
    pendingBalance: 10,
    availibleBalance: 75,
  };

  /**
   * data needed for transaction History
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

  const balanceHistoryGraphData = {
    historyData: [0, 23, 14, 56, 75, 31, 56, 34, 12, 56, 78, 100],
  };

  return (
    <>
      <div className="CenterContent">
        <div className="leftSideContent">
          <CurrentBalance currentBalancedata={currentBalancedata} />
          <div className="transHistCard">
            <TransactionHistory
              transactionHistoryData={transactionHistoryData}
            />
          </div>
          <div className="purchaseCard">
            <PurchaseCoins />
          </div>
        </div>
        <div className="rightSideContent">
          <BalanceHistoryGraph
            balanceHistoryGraphData={balanceHistoryGraphData}
          />
        </div>
      </div>
    </>
  );
}

export default Wallet;
