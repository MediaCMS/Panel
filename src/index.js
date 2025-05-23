import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/index.css'

const root = createRoot(
    document.getElementById('root')
)

root.render(
    <BrowserRouter><App /></BrowserRouter>
)