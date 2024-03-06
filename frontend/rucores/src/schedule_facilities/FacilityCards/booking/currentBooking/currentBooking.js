import PropTypes from "prop-types";
import React from "react";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import CreateBooking from "./createBooking/createBooking";
import "./currentBooking.css";
function CurrentBooking(props) {
  const formatTime = (timeString) => {
    const formattedTime = new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };

  // eslint-disable-next-line no-unused-vars
  function roundToNearestMinutes(date, nearestTo, isEndTime) {
    const roundedMinutes = isEndTime
      ? Math.round(date.getMinutes() / nearestTo) * nearestTo - 30
      : Math.round(date.getMinutes() / nearestTo) * nearestTo;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  return (
    <>
      <div className="makeBooking">
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Row>
            <Col sm={4}>
              <ListGroup>
                {props.currentBooking.map((item, index) => (
                  <ListGroup.Item key={index} action href={"#link" + index}>
                    {formatTime(item.startTime)}-{formatTime(item.endTime)}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                {props.currentBooking.map((item, index) => (
                  <Tab.Pane key={index} eventKey={"#link" + index}>
                    <CreateBooking
                      currentAvail={item}
                      facilityID={props.facilityID}
                    />{" "}
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}

CurrentBooking.propTypes = {
  currentBooking: PropTypes.array,
  facilityID: PropTypes.number,
};

export default CurrentBooking;
