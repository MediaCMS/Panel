"use strict"

import React, { useState, useEffect, useMemo } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"
import routes from "./routes.js"
import settings from "./settings.js"
import menu from "./menu.js"

const api = axios.create({
    baseURL: settings.api.url,
    timeout: settings.api.timeout
})

api.interceptors.request.use(function (config) {
    if (Array.isArray(config.url)) {
        config.url = config.url.join('/')
    }
    return config
}, function (error) {
    console.log('api.request.error.message', error.message)
    if (error?.request) {
        console.log('api.response.error.request', error.request)
    }
    return Promise.reject(error)
})

export default function (props) {

    const navigate = useNavigate()

    const [title, setTitle] = useState()
    const [message, setMessage] = useState()

    const loginURL = routes.Access.path + '/' + routes.Access.actions.Login.path;

    useMemo(() => {
        api.interceptors.response.use(function (response) {
            return response.data
        }, function (error) {
            console.log('api.response.error.message', error.message)
            if (error?.request) {
                console.log('api.response.error.request', error.request)
            }
            if (error?.response) {
                console.log('api.response.error.response', error.response)
                if (error.response.status === 401) {
                    navigate(loginURL, { replace: true })
                }
                if (error.response?.data?.message) {
                    setMessage(error.response.data.message)
                }
            }
            return Promise.reject(error)
        })
    }, [])

    useEffect(() => {
        if (!localStorage.getItem('user')) {
             navigate(loginURL, { replace: true })
        }
        setTitle(props.controller.title + '.' + (props.action?.title ?? null))
        setMessage(null)
    }, [props])

    return ((typeof props.action.layout === 'undefined') || (props.action?.layout === true)) ? (
        <>
            <header>
                <Navigation />
            </header>
            <main className="container" >
                <h1 className="my-5">{title}</h1>
                {message ? (<div className="box alert alert-danger text-center">{message}</div>) : null}
                <div id="body" className={(props.controller.name + ' ' + props.action.name).toLowerCase()}>
                    {React.createElement(
                        props.controller.element[props.action.name], 
                        { ...props, api, setTitle, setMessage })
                    }
                </div>
            </main>
            <footer className="text-center mt-5">
                <div
                    dangerouslySetInnerHTML={{ __html: settings.alert }}
                    className="alert alert-info my-5 box"
                    role="alert"
                />
                <Menu />
                <p className="text-muted small mt-3" title={settings.slogan}>
                    {settings.name} &copy; {settings.copyright}
                </p>
            </footer>
        </>
    ) : (
        React.createElement(props.controller.element[props.action.name], { ...props, api, loginURL })
    );
}

function Navigation() {

    const [user] = useState(JSON.parse(localStorage.getItem('user')))

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand" title={settings.slogan}>
                    <img src="/logo.png" alt={settings.name} width="100" />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-lg-0">
                        {menu.map((item, index) => (
                            <li className="nav-item" key={index} title={item.description}>
                                <NavLink to={encodeURI(item.url)} className="nav-link" >
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                {user ? (
                    <div title={user.role + ' ' + user.description}>
                        {user.title}
                        {user.image 
                            ? (<img src={settings.images.url + user.image} height="36px" className="rounded-3 ms-3" />) 
                            : null}
                    </div>
                ) : null}
                
            </div>
        </nav>
    )
}

function Menu() {
    return (
        <ul className="nav justify-content-center">
            {menu.map((item, index) => (
                <li className="nav-item" key={index}>
                    <NavLink
                        to={encodeURI(item.url)}
                        className="nav-link small p-2"
                        title={item.description}>
                        {item.title}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}