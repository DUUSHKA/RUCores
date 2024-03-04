import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./CreateAccountPage.css";
// import InputGroup from 'react-bootstrap/InputGroup';
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

function CreateAccountPage() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    isProvider: false,
  });

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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Error details:", errorBody.errors);
        throw new Error(errorBody.message || "Failed to create account");
      }

      const result = await response.json();
      console.log("User created successfully:", result);
      navigate("/login");
    } catch (error) {
      console.error("Error creating user:", error);
      //setError(error.message);
    }
  };
  return (
    <div className="loginCard">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username/NetID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username/NetID"
            name="username"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Are you a provider?"
          name="isProvider"
          onChange={handleChange}
        />
        <Button variant="primary" type="submit">
          Create Account
        </Button>
        <Link to="/" className="btn btn-link">
          Back To Login
        </Link>
      </Form>
    </div>
  );
}

export default CreateAccountPage;
