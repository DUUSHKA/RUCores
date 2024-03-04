import React, { useState } from "react";
import "./login.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

function Login() {

  // const [isRequestSent, setIsRequestSent] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  



  const handlePostRequest = async () => {
    try {
      const postData = {
      "username": {username},
      "password": {password}};
      console.log(postData);
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Handle the response data if needed
      const result = await response.json();
      console.log('Post created successfully:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
                        onChange={(e) =>(setUsername(e.target.value))}
                    />
                </InputGroup>
                <InputGroup className="passwordInput">
                    <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                    <Form.Control
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                        onChange={(e) =>(setPassword(e.target.value))}
                    />
                </InputGroup>
                <Link to="/CreateAccountPage">
                    <Button variant="link">{"Create account"}</Button>
                </Link>

                <Button style={buttonColor} onClick={handlePostRequest}>Login</Button>
                <Link to="/dashboard">
                    
                </Link>
            </div>
            {username}
            {password}
        </>
    );

}

export default Login;
