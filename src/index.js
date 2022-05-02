"use strict"

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, useRoutes } from "react-router-dom"
//import App from "./App.js"
import routes from "./routes.js"
import "./index.scss"

ReactDOM.render(
    <BrowserRouter><App /></BrowserRouter>,
    document.getElementById("root")
)

function App() {

    return useRoutes(routes)
}