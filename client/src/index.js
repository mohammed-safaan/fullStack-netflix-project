import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { GlobalStyles } from "./global-styles";
import { BrowserRouter } from "react-router-dom";
// import store from redux
import { store } from "./app/store";
import { Provider } from "react-redux";

<link
  href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap"
  rel="stylesheet"
></link>;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
