import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "./CreateAccountPage.css";
// import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import SuccessFailureAlert from "../../SuccessFailureAlerts";
import User from "../../UserCalls";

function CreateAccountPage(props) {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    isProvider: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    if (props.isUpdateAccount) {
      const userAPI = new User();
      userAPI.getCurrentUser().then((res) => {
        console.log(res);
        setUserDetails({
          firstName: res.firstName,
          lastName: res.lastName,
          username: res.username,
          email: res.email,
          password: window.sessionStorage.getItem("pw"),
          isProvider: res.isProvider,
        });
      });
    }
  }, [props.isUpdateAccount]);

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

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is Required!"),
    lastName: Yup.string().required("Last Name is Required!"),
    username: Yup.string().required("Username Name is Required!"),
    email: Yup.string()
      .required("Email is Required!")
      .email("Invalid Email Format!"),
    password: Yup.string()
      .required("Password Required!")
      .min(8, "Password must be at least 8 characters!")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol!",
      )
      .matches(/[0-9]/, "Password must contain at least one number!")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter!")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter!"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = userDetails.firstName;
    const lastName = userDetails.lastName;
    const userName = userDetails.username;
    const email = userDetails.email;
    const password = userDetails.password;
    const roles = userDetails.roles;
    const isProvider = userDetails.isProvider;

    const userAPI = new User();
    if (!props.isUpdateAccount) {
      userAPI
        .createUser(
          firstName,
          lastName,
          userName,
          email,
          password,
          roles,
          isProvider,
        )
        .then((resp) => {
          if (resp.firstName) {
            navigate("/");
          } else {
            setShowError(true);
          }
        });
    } else {
      const userID = parseInt(window.sessionStorage.getItem("id"));
      userAPI
        .updateUser(userID, firstName, lastName, email, userName, password)
        .then((resp) => {
          if (resp == false) {
            setShowError(true);
          } else {
            setShowSuccess(true);
          }
          console.log(resp);
        });
    }

    try {
      await validationSchema.validate(userDetails, { abortEarly: false });
      console.log("Form Submitted", userDetails);
    } catch (error) {
      const newErrors = {};

      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  const closeAlert = () => {
    setShowSuccess(false);
    setShowError(false);
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
            value={userDetails.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div className="error">{errors.firstName} </div>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <div className="error">{errors.lastName} </div>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username/NetID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username/NetID"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
          />
          {errors.username && <div className="error">{errors.username} </div>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error">{errors.email} </div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="passwordCreateAccount">
            <Form.Control
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={userDetails.password}
              onChange={handleChange}
            />

            <Button
              variant="outline-secondary"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="showHideButton"
            >
              {passwordVisible ? "Hide" : "Show"}
            </Button>
          </div>
          {errors.password && <div className="error">{errors.password} </div>}
        </Form.Group>

        {props.isUpdateAccount ? (
          <div></div>
        ) : (
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Are you a provider?"
            name="isProvider"
            checked={userDetails.isProvider}
            onChange={handleChange}
          />
        )}
        <Button variant="primary" type="submit">
          {props.isUpdateAccount ? "Update Account" : "Create Account"}
        </Button>
        {props.isUpdateAccount ? (
          <div className="blankPadding"></div>
        ) : (
          <Link to="/" className="btn btn-link">
            Back To Login
          </Link>
        )}
      </Form>
      <SuccessFailureAlert
        variant={"success"}
        show={showSuccess}
        alertText={"Successfully Updated Account Info!"}
        onClose={closeAlert}
      ></SuccessFailureAlert>
      <SuccessFailureAlert
        variant={"danger"}
        show={showError}
        alertText={"Failed!"}
        onClose={closeAlert}
      ></SuccessFailureAlert>
    </div>
  );
}

CreateAccountPage.propTypes = {
  isUpdateAccount: PropTypes.number,
};

export default CreateAccountPage;
