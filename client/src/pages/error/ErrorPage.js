import React from "react";
import "./error.css";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="error">
      <div className="nav">
        <img
          className="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
          alt=""
        />
      </div>
      <div className="error-body">
        <h1>Lost Your Way?</h1>
        <h3> Error 404 Page Not Found </h3>
        <p>
          {" "}
          Sorry, we can't find that page. <br />
          You'll find lots to explore on the home page.{" "}
        </p>
      </div>
      <div className="end">
        <Link to="/">
          <button className=" btn"> Back Home</button>
        </Link>
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default ErrorPage;
