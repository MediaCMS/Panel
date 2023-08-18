import React, { useState, useEffect, useMemo } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import Header from './Header.js'
import Submenu from './Submenu.js'
import Message from './Message.js'
import Footer from './Footer.js'
import APIFactory from './api.js'
import menuSource from './menu.js'

const userStorage = JSON.parse(
    localStorage.getItem('user')
)

const paramsDefault = {
    title: '', width: 'full', submenu: []
}

export default function (props) {

    const [menu, setMenu] = useState()
    const [user, setUser] = useState(userStorage)
    const [params, setParams] = useState(userStorage)
    const [message, setMessage] = useState()
    const [spinner, setSpinner] = useState(false)
    const navigate = useNavigate()

    const init = paramsNew => {
        setParams({ ...paramsDefault, ...paramsNew })
    }

    const setAlert = message => {
        setMessage({
            type: 'alert', title: 'Повідомлення', body: message
        })
    }

    const setConfirm = (message) => {
        return new Promise((resolve, reject) => {
            setMessage({
                type: 'confirm',
                title: 'Підтвердження',
                body: message,
                onTrue: () => resolve(true),
                onFalse: () => resolve(false)
            })
        });
    }

    const api = useMemo(() => ({
        main: APIFactory.createMain(setSpinner, setAlert),
        panel: APIFactory.createPanel(setSpinner, setAlert, navigate),
        image: APIFactory.createImage(setSpinner, setAlert)
    }), [])

    useEffect(() => {
        if (!user) return
        const menuNew = menuSource.filter(item => 
            item.level >= user.role.level
        )
        setMenu(menuNew)
    }, [user])

    return (
        <React.StrictMode>
            {props?.template ?
                user ? (
                    <>
                        <Header menu={menu} user={user} />
                        <main className="container" >
                            <div id="header" className="my-5 d-flex">
                                <h1 className="me-auto">{params?.title}</h1>
                                <ul className="nav">
                                    {params?.submenu &&
                                        <Submenu items={params.submenu} setConfirm={setConfirm} />}
                                </ul>
                            </div>
                            <div id="body" className={' width-' + params?.width}>
                                <Outlet context={{
                                    init, api, user, setSpinner, setAlert, setConfirm, setMessage
                                }} />
                            </div>
                        </main>
                        <Footer menu={menu} user={user} />
                    </>
                ) : <Navigate to={encodeURI('/доступ/вхід')} replace />
            : <Outlet context={{api, setUser, setAlert, setSpinner}} />}
            <Message {...message} setMessage={setMessage} />
            {spinner && (
                <div className="spinner-border position-fixed bottom-50 start-50"
                    role="status" style={{ zIndex: 9999 }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
        </React.StrictMode>
    )
}