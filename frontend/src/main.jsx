import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/master.scss";
import "font-awesome/css/font-awesome.min.css";
import "react-modal-video/scss/modal-video.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
