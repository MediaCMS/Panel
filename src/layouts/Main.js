import React, { useState, useEffect, useMemo } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './Main/Header.js'
import Submenu from '../components/Menu.js'
import Message from './Main/Message.js'
import Footer from './Main/Footer.js'
import APIFactory from '../services/api.js'
import menuSource from '../menu.js'

const userStorage = JSON.parse(
    localStorage.getItem('user')
)

const paramsDefault = {
    title: '', width: 'full', submenu: []
}

const Main = ({ template }) => {

    const [menu, setMenu] = useState()
    const [user, setUser] = useState(userStorage)
    const [params, setParams] = useState(userStorage)
    const [message, setMessage] = useState()
    const [wait, setWait] = useState(false)
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
        return new Promise((resolve) => {
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
        main: APIFactory.createMain(setWait, setAlert),
        panel: APIFactory.createPanel(setWait, setAlert, navigate),
        image: APIFactory.createImage(setWait, setAlert)
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
            {template ?
                user ? (
                    <>
                        <Header menu={menu} user={user} />
                        <main className="container" >
                            <div id="header" className="my-5 d-flex">
                                <h1 className="me-auto">{params?.title}</h1>                                
                                <Submenu items={params?.submenu} setConfirm={setConfirm} />
                            </div>
                            <div id="body" className={' width-' + params?.width}>
                                <Outlet context={{
                                    init, api, user, setWait, setAlert, setConfirm, setMessage
                                }} />
                            </div>
                        </main>
                        <Footer menu={menu} user={user} />
                    </>
                ) : <Navigate to="/access/login" replace />
            : <Outlet context={{api, setUser, setAlert, setWait}} />}
            <Message {...message} setMessage={setMessage} />
            {wait && (
                <div className="spinner-border position-fixed bottom-50 start-50"
                    role="status" style={{ zIndex: 9999 }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
        </React.StrictMode>
    )
}

Main.propTypes = {
    template: PropTypes.bool
}

export default Main