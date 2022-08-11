import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import Footer from "../../components/containers/Footer";
import joi from "joi";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const [errorValidation, setErrorValidation] = useState([]);
  const [errorRegister, setErrorRegister] = useState("");
  const [confirm, setConfirm] = useState("");

  // ****************

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const navigate = useNavigate();

  // handle data in inputs
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // handle submition
  const onSubmit = async (e) => {
    e.preventDefault();
    let result = validation(formData);
    if (result.error) {
      setErrorValidation(result.error.details);
      console.log(result);
    } else {
      setErrorValidation([]);

      const userData = {
        username,
        email,
        password,
      };

      const { data } = await axios.post(
        `http://localhost:8800/api/auth/register`,
        userData
      );
      if (data.message === "Done") {
        setErrorRegister("");
        setConfirm("please confirm your email");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        console.log(555);
        setConfirm("");
        setErrorRegister(data.message);
      }
    }
  };

  // ******************

  function validation(user) {
    let schema = joi.object({
      username: joi.string().min(3).max(30).required(),
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "org"] },
        })
        .required(),
      password: joi.string().pattern(/^[A-Za-z0-9]{3,30}$/),
    });
    return schema.validate(user, { abortEarly: false });
  }

  return (
    <>
      <div className="login">
        <div className="top">
          {errorRegister && (
            <p className="top-err alert alert-danger text-center fw-bold fs-5">
              {errorRegister}
            </p>
          )}
          {confirm && (
            <p className="top-conf alert alert-success text-center fw-bold fs-5">
              {confirm}
            </p>
          )}
          <div className="wrapper">
            <Link to="/register">
              <img
                className="logo"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
                alt=""
              />
            </Link>
          </div>
        </div>
        <div className="container">
          <form onSubmit={onSubmit}>
            <h1>Register</h1>
            <input
              type="text"
              name="username"
              placeholder="Enter user name"
              value={username}
              onChange={onChange}
            />

            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter email"
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />

            <button className="loginbutton" type="submit">
              Register
            </button>
            {errorValidation.map((el, i) => {
              return (
                <div className="text-danger" key={i}>
                  {el.message}
                </div>
              );
            })}
            {errorRegister ? (
              <div className="text-danger">{errorRegister}</div>
            ) : (
              ""
            )}
            <span>
              New To Netflix ?
              <Link className="signUp" to="/login">
                <b>Log in Now</b>
              </Link>
            </span>
            <small>
              this page is protected by google reCHAPCH To ensure you are not
              abot. <b>learn more</b>{" "}
            </small>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
