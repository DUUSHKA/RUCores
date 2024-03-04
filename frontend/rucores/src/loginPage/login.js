import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  // const [isRequestSent, setIsRequestSent] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const reroute = (result) => {
    window.sessionStorage.setItem("isProvider", String(result.isProvider));
    window.sessionStorage.setItem("id", String(result.id));

    navigate("/dashboard");
  };

  const handlePostRequest = async () => {
    try {
      const postData = {
        username: username,
        password: password,
      };

      const url = "http://localhost:3001/api/users/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const result = await response.json();
      console.log("Post created successfully:", result);
      reroute(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /**
   * set background color to red for login button
   */
  const buttonColor = {
    backgroundColor: "red",
  };

  /**
   *  rutgers logo for login page
   */
  // eslint-disable-next-line no-undef
  const RULogo = require("../assets/Logo-Rutgers-University.jpg");

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
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="passwordInput">
          <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
          <Form.Control
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <Link to="/CreateAccountPage">
          <Button variant="link">{"Create account"}</Button>
        </Link>

        <Button style={buttonColor} onClick={handlePostRequest}>
          Login
        </Button>
        <Link to="/dashboard"></Link>
      </div>
      {username}
      {password}
    </>
  );
}

export default Login;
