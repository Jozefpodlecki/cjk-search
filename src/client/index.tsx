import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "../hanzi_lookup.js"

const root = document.getElementById("root");

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    root
);
