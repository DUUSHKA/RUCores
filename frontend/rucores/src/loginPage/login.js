import React from 'react';
import './login.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';


function Login() {

    /**
     * set background color to red for login button
     */
    const buttonColor = {
        backgroundColor:"red"
    };

    /**
     *  rutgers logo for login page
     */
    // eslint-disable-next-line no-undef
    const RULogo = require('../assets/Logo-Rutgers-University.jpg');

    
    return (
        <>
            
            <div className="loginCard">
            <img className="image" src={RULogo}></img>
                <InputGroup className="userNameInput">
                    <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
                    <Form.Control
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <InputGroup className="passwordInput">
                    <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                    <Form.Control
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <Link to="/home">
                    <Button style={buttonColor}>Login</Button>
                </Link>
            </div>
        </>
    );

}

export default Login;