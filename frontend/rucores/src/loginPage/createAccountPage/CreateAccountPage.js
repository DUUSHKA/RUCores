import React from 'react';
import './CreateAccountPage.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
// import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';


function CreateAccountPage() {

    // /**
    //  * set background color to red for login button
    //  */
    // const buttonColor = {
    //     backgroundColor: "red"
    // };

    // /**
    //  *  rutgers logo for login page
    //  */
    // // eslint-disable-next-line no-undef
    // const RULogo = require('../assets/Logo-Rutgers-University.jpg');


    return (
        <>
            <div className="loginCard">
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="FirstName" placeholder="First Name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="LastName" placeholder="Last Name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username/NetID</Form.Label>
                        <Form.Control type="Username/NetID" placeholder="Username/NetID" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We will never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="pass" placeholder="Password" />
                    </Form.Group>
                    <Form.Check // prettier-ignore
                        type="switch"
                        id="custom-switch"
                        label="Are you a provider?"
                    />
                    <Link to="/">
                        <Button variant="primary" type="submit">
                            Create Account
                        </Button></Link>
                    <Link to="/">
                        <Button variant="link">Back To Login</Button>
                    </Link>

                </Form>
            </div>
        </>
    );

}

export default CreateAccountPage;