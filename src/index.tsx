import "./scss/main.scss";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { PreduxProvider } from "./predux/Provider";

ReactDOM.render(
  <StrictMode>
    <PreduxProvider>
      <Router>
        <App />
      </Router>
    </PreduxProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
