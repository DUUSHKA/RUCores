import React from "react";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";

/**
 *
 * @param {*} props enter variant:
 *
 *
 *      'success',
 *        'danger',
 *        'warning',
 * and alertText, and show to say if it should be shown
 * @returns
 */
function SuccessFailureAlert(props) {
  return (
    <>
      {props.show && (
        <Alert variant={props.variant} dismissible onClose={props.onClose}>
          {props.alertText}
        </Alert>
      )}
    </>
  );
}

SuccessFailureAlert.propTypes = {
  variant: PropTypes.string,
  alertText: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default SuccessFailureAlert;
