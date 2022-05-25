"use strict"

import React, { useState, useEffect, useMemo } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import axios from "axios"
import settings from "../settings.js"
import menu from "../menu.js"

const api = axios.create({
    baseURL: settings.api.url,
    timeout: settings.api.timeout
})

api.interceptors.request.use(function (config) {
    if (Array.isArray(config.url)) {
        config.url = '/' + config.url.join('/')
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
    const [params, setParams] = useState(
        {title: '', router: ['', ''], submenu: []}
    )
    const [message, setMessage] = useState()

    const setHeader = (params) => {
        setParams(params)
        setMessage(null)
    }

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
                if (error.response?.status) {
                    if (error.response.status === 401) {
                        navigate(encodeURI('/доступ/вхід'))
                    }
                    if (error.response.status === 403) {
                        alert('Недостатній рівень доступу')
                    }
                } else {
                    console.log('Перевищенно час очікування відповіді сервера')
                }
                if (error.response?.data?.message) {
                    setMessage(error.response.data.message)
                }
            }
            return Promise.reject(error)
        })
    }, [])

    return props.template ? (
        <>
            <header>
                <Navigation />
            </header>
            <main className="container" >
                <div id="header" className="my-5 d-flex">
                    <h1 className="me-auto">{params.title}</h1>
                    <ul className="nav">
                        {params.submenu.map(item => (
                            <li className="nav-item" key={item.url}>
                                <NavLink to={encodeURI(item.url)} className="nav-link" >
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                {message ? (<div className="box alert alert-danger text-center">{message}</div>) : null}
                <div id="body" className={params.router[0] + ' ' + params.router[1]}>
                    <Outlet context={{api, setParams, setMessage}} />
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
    ) : <Outlet context={{api}} />
}

function Navigation() {

    const [user] = useState(
        JSON.parse(localStorage.getItem('user'))
    )

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
                    <div title={user.role.title + ' ' + user.description}>
                        {user.title}
                        {user.image 
                            ? (<img src={settings.images.url + user.image}
                                    height="36px" className="rounded-3 ms-3" />) 
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