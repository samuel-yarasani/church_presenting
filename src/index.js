import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import Live from "./componets/live";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/live" element={<Live/>}/>
            </Routes>
        </Router>
    </React.StrictMode>
);
