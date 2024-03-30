import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FacilityCalls from "../FacilityCalls";
import Wallet from "./wallet/wallet";
import FacilityWallet from "./facilityWallet/facilityWallet";
import './walletManager.css';
function WalletManager() {
  const [providerDisplay, setProviderDisplay] = useState(false);
  const [providerUserwallet, setProviderUserWallet] = useState(true);
  const [facilityData, setFacilityData] = useState();
  const [selectedFacility, setSelectedFacility] = useState();

  useEffect(() => {
    const facilityCalls = new FacilityCalls();

    if (window.sessionStorage.getItem("isProvider") === "true") {
      facilityCalls.getFacilitiesByUser().then((resp) => {
        if (resp) {
          setProviderDisplay(true);
          setProviderUserWallet(true);
          setFacilityData(resp);
        }
      });
    }
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === "1") {
      setProviderUserWallet(value === "1");
      setSelectedFacility(null);
    } else {
      const facility = facilityData.find((facility) => facility.name === value);
      setSelectedFacility(facility);
    }
  };

  return (
    <>
      {providerDisplay && (
        <div className="CenterContent">
        <Form.Select className="dropdownSelect" onChange={handleSelectChange}>
          <option >Select a Wallet</option>
          <option value="1">Your Wallet</option>
          {facilityData.map((option, index) => (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          ))}
        </Form.Select>
        <div className="SelectSpacer"></div>
        </div>
      )}
      {(providerUserwallet || !providerDisplay) && selectedFacility == null && (
        <Wallet />
      )}
      {selectedFacility && selectedFacility.id && (
        <FacilityWallet facility={selectedFacility} />
      )}
    </>
  );
}

export default WalletManager;
