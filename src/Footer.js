import React from 'react'
import { NavLink } from 'react-router-dom'
import config from './config.js'

export default function (props) {

    return (
        <footer className="text-center mt-5">
            <div className="alert alert-info my-5 box" role="alert">
                Демонстраційний сайт <a href="https://github.com/MediaCMS"
                    className="alert-link">MediaCMS</a>
            </div>
            <ul className="nav justify-content-center">
                {props?.menu && props.menu.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <NavLink
                            to={encodeURI(item.path)}
                            className="nav-link small p-2"
                            title={item.description}>
                            {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <p className="text-muted small mt-3" title={config.brand}>
                {config.brand} &copy; {config.copyright}
            </p>
        </footer>
    )
}