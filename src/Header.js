import React from 'react'
import { NavLink } from 'react-router-dom'
import config from './config.js'

export default function (props) {

    return (
        <header>
            <nav className="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                    <NavLink to="/" className="navbar-brand" title={config.slogan}>
                        <img src="/logo.png" alt={config.name} />
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {props?.menu && (
                            <ul className="navbar-nav me-auto mb-lg-0">
                                {props.menu.map((item, index) =>
                                    <li className="nav-item" key={index} title={item.description}>
                                        <NavLink to={encodeURI(item.path)} className="nav-link" >
                                            {item.title}
                                        </NavLink>
                                    </li>
                                )}
                                <li className="nav-item" title="Вихід з панелі куерування">
                                    <NavLink to={encodeURI('/доступ/вихід')} className="nav-link">
                                        Вихід
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="d-none d-xl-block text-light"
                        title={props.user.role.title + ' ' + props.user.description}>
                        {props.user.title}
                        {props.user.image ? (
                            <img src={config.images.url + props.user.image}
                                height="36px" className="rounded-3 ms-3" />
                        ) : null}
                    </div>
                </div>
            </nav>
        </header>
    )
}