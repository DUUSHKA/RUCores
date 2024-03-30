import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FacilityBalanceHistoryGraph from "./balanceHistoryGraphFacility/FacilityBalanceHistoryGraph";
import CurrentFacilityBalance from "./currentBalance/currentFacilityBalance";
import FacilityTransactionHistory from "./transactionHistory/facilityTransactionHistory";
/**
 *
 * wallet page- contains current balance, analytics
 *
 * @returns none
 */
function FacilityWallet(props) {
  const [currentFacility, setCurrentFacility] = useState();

  useEffect(() => {
    setCurrentFacility(props.facility);
    console.log(props.facility);
  }, [props.facility]);

  return (
    <>
      {currentFacility && (
        <div className="CenterContent">
          <div className="leftSideContent">
            <CurrentFacilityBalance currentFacilityId={currentFacility.id} />
            <div className="transHistCard">
              <FacilityTransactionHistory facilityID={currentFacility.id}></FacilityTransactionHistory>
            </div>
            <div className="purchaseCard">
              {/* <PurchaseCoins updateBalance={[updateBalance, setUpdateBalance]} /> */}
            </div>
          </div>
          <div className="rightSideContent">
            <FacilityBalanceHistoryGraph facilityID={currentFacility.id} />
          </div>
        </div>
      )}
    </>
  );
}

FacilityWallet.propTypes = {
  facility: PropTypes.object,
};

export default FacilityWallet;
