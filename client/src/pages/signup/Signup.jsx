import { Link, useNavigate } from 'react-router-dom';
import './signup.scss';
import Footer from '../../components/containers/Footer';
import joi from 'joi';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [errorValidation, setErrorValidation] = useState([]);
  const [errorRegister, setErrorRegister] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorValidationName, setErrorValidationName] = useState('');
  const [errorValidationEmail, setErrorValidationEmail] = useState('');
  const [errorValidationPassword, setErrorValidationPassword] = useState('');

  // ****************

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
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
      //setErrorValidation(result.error.details);
      if (result.error.details[0].path[0] === 'username') {
        setErrorValidationName(result.error.details[0].message);
      } else {
        setErrorValidationName('');
      }
      if (result.error.details[0].path[0] === 'email') {
        setErrorValidationEmail(result.error.details[0].message);
      } else {
        setErrorValidationEmail('');
      }
      if (result.error.details[0].path[0] === 'password') {
        setErrorValidationPassword(result.error.details[0].message);
      } else {
        setErrorValidationPassword('');
      }
      console.log(result.error.details[0].path[0] === 'username');
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
      if (data.message === 'Done') {
        setErrorValidationName('');
        setErrorValidationEmail('');
        setErrorValidationPassword('');
        setErrorRegister('');
        setConfirm('please confirm your email');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.log(555);
        setConfirm('');
        setErrorRegister(data.message);
        setErrorValidationName('');
        setErrorValidationEmail('');
        setErrorValidationPassword('');
      }
    }
  };

  // ******************

  function validation(user) {
    let schema = joi.object({
      username: joi.string().min(3).max(30).required().messages({
        'string.empty': 'plz enter your name',
        'string.min': 'min length must be at least 3 characters',
        'string.max': 'max length must be at less than 30 characters',
      }),
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net', 'org'] },
        })
        .required()
        .messages({
          'string.empty': 'plz enter your email',
          'string.email': 'plz enter valid email',
        }),
      password: joi
        .string()
        .pattern(/^[A-Za-z0-9]{5,30}$/)
        .messages({
          'string.empty': 'plz enter your password',
          'string.pattern.base':
            'password pattern is A-Z or a-z or 0-9 min length is 5 and max length is 30',
        }),
    });
    return schema.validate(user, { abortEarly: false });
  }

  return (
    <>
      <div className="login">
        <div className="top">
          {/* {errorRegister && (
            <p className="top-err alert alert-danger text-center fw-bold fs-5">
              {errorRegister}
            </p>
          )} */}
          {/* {confirm && (
            <p className="top-conf alert alert-success text-center fw-bold fs-5">
              {confirm}
            </p>
          )} */}
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
        {/* {errorValidation
          ? errorValidation.map((el, i) => (
              <div key={i} className="text-light text-center h3">
                {el.message}
              </div>
            ))
          : ''} */}
        <div className="container justify-content-start">
          {errorRegister && (
            <p className="top-err alert alert-danger text-center fw-bold fs-5 w-50">
              {errorRegister}
            </p>
          )}
          {confirm && (
            <p className="top-conf alert alert-success text-center fw-bold fs-5 w-50">
              {confirm}
            </p>
          )}
          <form onSubmit={onSubmit}>
            <h1>Register</h1>
            <input
              type="text"
              name="username"
              placeholder="Enter user name"
              value={username}
              onChange={onChange}
            />
            {errorValidationName ? (
              <div className="text-warning text-center h5">
                {errorValidationName}
              </div>
            ) : (
              ''
            )}

            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter email"
              onChange={onChange}
            />
            {errorValidationEmail ? (
              <div className="text-warning text-center h5">
                {errorValidationEmail}
              </div>
            ) : (
              ''
            )}

            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
            {errorValidationPassword ? (
              <div className="text-warning text-center h5">
                {errorValidationPassword}
              </div>
            ) : (
              ''
            )}

            <button className="loginbutton" type="submit">
              Register
            </button>

            <span>
              New To Netflix ?
              <Link className="signUp" to="/login">
                <b>Log in Now</b>
              </Link>
            </span>
            <small>
              this page is protected by google reCHAPCH To ensure you are not
              abot. <b>learn more</b>{' '}
            </small>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
