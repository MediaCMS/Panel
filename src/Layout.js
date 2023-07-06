import React, { useState, useEffect, useMemo } from 'react'
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import APIFactory from './api.js'
import config from './config.js'
import menuSource from './menu.js'

const userStorage = JSON.parse(localStorage.getItem('user'))

const paramsDefault = {
    title: config.title, router: 'main', size: 'full', submenu: []
}

export default function (props) {

    const [menu, setMenu] = useState()
    const [user, setUser] = useState(userStorage)
    const [params, setParams] = useState(userStorage)
    /*
    const [title, setTitle] = useState()
    const [submenu, setSubmenu] = useState()
    const [router, setRouter] = useState()
    const [container, setContainer] = useState()
    const [width, setWidth] = useState()
    */
    const [message, setMessage] = useState()
    const [spinner, setSpinner] = useState(false)
    //const [key, setKey] = useState(localStorage.getItem('key'))
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!user) return
        setMenu(
            menuSource.filter(item => 
                item.access >= user.role.level
            )
        )
    }, [user])

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
                            <div id='body' className={params?.router + ' ' + params?.size}>
                                <Outlet context={{
                                    init, api, setSpinner, setAlert, setConfirm, setMessage
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

function Header(props) {

    return (
        <header>
            <nav className='navbar navbar-expand-sm navbar-light bg-light'>
                <div className='container-fluid'>
                    <NavLink to='/' className='navbar-brand' title={config.slogan}>
                        <img src='/logo.png' alt={config.name} width='100' />
                    </NavLink>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent'
                        aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon' />
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        {props?.menu && (
                            <ul className='navbar-nav me-auto mb-lg-0'>
                                {props.menu.slice(0, 5).map((item, index) => (
                                    <li className='nav-item' key={index} title={item.description}>
                                        <NavLink to={encodeURI(item.path)} className='nav-link' >
                                            {item.title}
                                        </NavLink>
                                    </li>
                                ))}
                                {(props.menu.length > 5) && (
                                    <li className='nav-item dropdown'>
                                        <a className='nav-link dropdown-toggle' href='#' id='navbarDropdown'
                                            role='button' data-bs-toggle='dropdown' aria-expanded='false'>...</a>
                                        <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                            {props.menu.slice(5).map((item, index) => (
                                                <li key={index} title={item.description}>
                                                    <NavLink to={encodeURI(item.url)} className='dropdown-item' >
                                                        {item.title}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                )}
                                <li className='nav-item' title='Вихід з панелі куерування'>
                                    <NavLink to={encodeURI('/доступ/вихід')} className='nav-link'>
                                        Вихід
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    {props?.user ? (
                        <div title={props.user.role.title + ' ' + props.user.description}>
                            {props.user.title}
                            {props.user.image ? (
                                <img src={config.images.url + props.user.image}
                                    height='36px' className='rounded-3 ms-3' />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </nav>
        </header>
    )
} 

function Submenu(props) {
    return props.items.map(item => (
        <li className="nav-item" key={item.title}>
            <NavLink to={encodeURI(item?.path ?? '#')}
                onClick={() => {
                    if (item?.onClick) {
                        if (item?.confirm) {
                            if (!props.setConfirm(item.description + '?')) {
                                return
                            }
                        }
                        item.onClick()
                    }
                }}
                data-bs-toggle={item?.toggle}
                className="nav-link"
                title={item?.description}>
                {item.title}
            </NavLink>
        </li>
    ))
}

function Footer(props) {

    return (
        <footer className='text-center mt-5'>
            <div className='alert alert-info my-5 box' role='alert'>
                Демонстраційний сайт <a href="https://github.com/MediaCMS"
                    className="alert-link">MediaCMS</a>
            </div>
            <ul className='nav justify-content-center'>
                {props?.menu && props.menu.map((item, index) => (
                    (item.access >= props.user.role.level) ? (
                        <li className='nav-item' key={index}>
                            <NavLink
                                to={encodeURI(item.path)}
                                className='nav-link small p-2'
                                title={item.description}>
                                {item.title}
                            </NavLink>
                        </li>
                    ) : null
                ))}
            </ul>
            <p className='text-muted small mt-3' title={config.brand}>
                {config.brand} &copy; {config.copyright}
            </p>
        </footer>
    )
}

function Message(props) {

    const handleClose = () => {
        props.setMessage(null)
    }

    return (
        <Modal show={!!props?.type} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props?.title ?? 'Повідомлення'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.body}</p>
            </Modal.Body>
            <Modal.Footer>
                {props.type === 'alert' ? (
                    <Button variant="primary" onClick={handleClose}>Зрозуміло</Button>
                ) : (
                    <>
                        <Button variant="secondary" onClick={() => {
                            props?.onFalse && props.onFalse()
                            handleClose()
                        }}>Ні, дякую</Button>
                        <Button variant="primary" onClick={() => {
                            props.onTrue()
                            handleClose()
                        }}>Гаразд</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}