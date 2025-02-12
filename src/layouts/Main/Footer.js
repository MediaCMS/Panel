import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'
import config from '../../config.js'
import '../../assets/styles/layouts/main/footer.css'

const Footer = ({ menu }) => {

    return (
        <footer className="text-center mt-5">
            <ul className="nav justify-content-center">
                {menu && menu.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <NavLink
                            to={item.path}
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

Footer.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string.isRequired,
        description: PropTypes.string,
        title: PropTypes.string.isRequired
    }))
}

export default Footer