import React, { useState, useEffect, useMemo } from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import API from './api.js'
import config from './config.js'
import menuStorage from './menu.js'

const userStorage = JSON.parse(localStorage.getItem('user'))

export default function (props) {

    const [params, setParams] = useState({
        title: '', router: '', container: true,
        width: 'standart', submenu: []
    })
    const [menu, setMenu] = useState(menuStorage)
    const [user, setUser] = useState(userStorage)
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false)
    //const [key, setKey] = useState(localStorage.getItem('key'))
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return
        setMenu({ items: menuStorage.filter(item => 
            item.access >= user.role.level
        )})
    }, [user])

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
        main: API.createMain(setLoading, setAlert),
        panel: API.createPanel(setLoading, setAlert, navigate),
        image: API.createImage(setLoading, setAlert)
    }), [])

    return props.template ? 
        user ? (
            <React.StrictMode>
                <Header items={menu.items} user={user} />
                <main className='container' >
                    <div id="header" className="my-5 px-5 d-flex">
                        <h1 className="me-auto">{meta.title}</h1>
                        <ul className="nav">
                            {meta?.submenu
                            && <Submenu items={meta.submenu} setConfirm={setConfirm} />}
                        </ul>
                    </div>
                    <div id='body' className={[params.router, params.width]}>
                        <Outlet context={{
                            setParams, setAlert, setConfirm, setMessage, api
                        }} />
                    </div>
                </main>
                <Footer menu={menu} />
                <Message {...message} setMessage={setMessage} />
                {loading && (
                    <div className="spinner-border position-fixed bottom-50 start-50"
                        role="status" style={{ zIndex: 9999 }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </React.StrictMode>
        ) : <Navigate to={encodeURI('/доступ/вхід')} replace />
    : <Outlet context={{setAlert, setUser, api}} />
}

function Submenu(props) {
    return props.items.map(item => (
        <li className="nav-item" key={item.title}>
            <NavLink to={encodeURI(item?.uri ?? '#')}
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
                        <ul className='navbar-nav me-auto mb-lg-0'>
                            {props.items.slice(0, config.menu).map((item, index) => (
                                <li className='nav-item' key={index} title={item.description}>
                                    <NavLink to={encodeURI(item.url)} className='nav-link' >
                                        {item.title}
                                    </NavLink>
                                </li>
                            ))}
                            {(props.items.length > config.menu) ? (
                                <li className='nav-item dropdown'>
                                    <a className='nav-link dropdown-toggle' href='#' id='navbarDropdown'
                                        role='button' data-bs-toggle='dropdown' aria-expanded='false'>...</a>
                                    <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                        {props.items.slice(config.menu).map((item, index) => (
                                            <li key={index} title={item.description}>
                                                <NavLink to={encodeURI(item.url)} className='dropdown-item' >
                                                    {item.title}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ) : null}
                            <li className='nav-item' title='Вихід з панелі куерування'>
                                <NavLink to={encodeURI('/доступ/вихід')} className='nav-link'>
                                    Вихід
                                </NavLink>
                            </li>
                        </ul>
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

function Footer(props) {
    
    return (
        <footer className='text-center mt-5'>
            <div className='alert alert-info my-5 box' role='alert'>
                Демонстраційний сайт <a href="https://github.com/MediaCMS"
                    className="alert-link">MediaCMS</a>
            </div>
            <ul className='nav justify-content-center'>
                {props.items.map((item, index) => (
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
            <p className='text-muted small mt-3' title={config.slogan}>
                {config.name} &copy; {config.copyright}
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