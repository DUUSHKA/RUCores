import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import SuccessFailureAlert from "../SuccessFailureAlerts";

function Login() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showError, setShowError] = useState(false);

  // const [isRequestSent, setIsRequestSent] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const reroute = (result) => {
    window.sessionStorage.setItem("isProvider", String(result.isProvider));
    window.sessionStorage.setItem("id", String(result.id));
    window.sessionStorage.setItem("pw", String(password));
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
        setShowError(true);
        return;
      }

      const result = await response.json();
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

  const closeAlert = () => {
    setShowError(false);
  };

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
          <div className="passwordCreateAccount">
            <Form.Control
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="showHideButton"
            >
              {passwordVisible ? "Hide" : "Show"}
            </Button>
          </div>
        </InputGroup>
        <Link to="/CreateAccountPage">
          <Button variant="link">{"Create account"}</Button>
        </Link>

        <Button style={buttonColor} onClick={handlePostRequest}>
          Login
        </Button>

        <SuccessFailureAlert
          variant={"danger"}
          show={showError}
          alertText={"Invalid Username or Password!"}
          onClose={closeAlert}
        ></SuccessFailureAlert>
        <Link to="/dashboard"></Link>
      </div>
    </>
  );
}

export default Login;
