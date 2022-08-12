import { Link } from "react-router-dom";
import "./login.scss";
import Footer from "../../components/containers/Footer";
import joi from "joi";
import { useSelector, useDispatch } from "react-redux";
import { login, reset, authSelector } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Login = () => {
  const [errorValidation, setErrorValidation] = useState([]);
  const [errorRegister, setErrorRegister] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isError, isSuccess, isLoading, message } = useSelector(authSelector);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  // Update UI based on the redux state(Success or Error)
  useEffect(() => {
    if (isError) {
      setErrorRegister(message);
      dispatch(reset());
    }
    if (isSuccess) {
      console.log("Success");
      dispatch(reset());
      navigate("/");
    }
  }, [isError, isSuccess]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrorRegister(null);
  };

  const onSubmit = (e) => {
    // **
    e.preventDefault();
    let result = validation(formData);
    if (result.error) {
      setErrorValidation(result.error.details);
      console.log(result);
    } else {
      setErrorValidation([]);
      // ***
      const userData = {
        email,
        password,
      };
      // redux login
      dispatch(login(userData));
    }
  };

  // *******************

  function validation(user) {
    let schema = joi.object({
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
          {errorRegister ? (
            <p className="alert alert-danger text-center fw-bold">
              {errorRegister.mes}
            </p>
          ) : (
            ""
          )}
          <div className="wrapper">
            <img
              className="logo"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
              alt=""
            />
          </div>
        </div>
        <div className="container">
          <form onSubmit={onSubmit}>
            <h1>Log in</h1>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={onChange}
            />
            <button className="loginbutton" type="submit">
              Log in
            </button>
            {errorValidation.map((el, i) => {
              return (
                <div className="text-danger" key={i}>
                  {el.message}
                </div>
              );
            })}
            {errorRegister ? (
              <div className="text-danger">{errorRegister.mes}</div>
            ) : (
              ""
            )}
            <span>
              New To Netflix ?
              <Link className="signUp" to="/signUp">
                <b>sign up Now</b>
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
