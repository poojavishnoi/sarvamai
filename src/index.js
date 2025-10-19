import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const div = document.createElement("div");
div.id = "ai-widget-root";
document.body.appendChild(div);

ReactDOM.createRoot(div).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
