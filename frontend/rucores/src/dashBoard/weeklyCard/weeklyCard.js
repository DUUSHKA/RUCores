import React from 'react';
import './weeklyCard.css';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';


function WeeklyCard() {

    /**
     * use state for modal
     */
    const [show, setShow] = useState(false);

    /**
     * 
     * @returns function for show and unshow
     */
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const cardObj = {
        cardTitle:"Event 1",
        subtitle:"Location",
        description:"3/10/24 - Facility"
    };

    return (
        <>
            <Card style={{ width: "100%" }}>
                <Card.Body>
                    <Card.Title>{cardObj.Title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{cardObj.subtitle}</Card.Subtitle>
                    <Card.Text>
                        {cardObj.description}
                    </Card.Text>
                    <Card.Link href="#" onClick={handleShow}>View More</Card.Link>
                    
                </Card.Body>
            </Card>



            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Event Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>event desc, and all other info goes here</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel Booking
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    );
}

export default WeeklyCard;
