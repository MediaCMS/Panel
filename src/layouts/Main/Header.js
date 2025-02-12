import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import config from '../../config.js'

const Header = ({ menu, user }) => {

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
                        {menu && (
                            <ul className="navbar-nav me-auto mb-lg-0">
                                {menu.map((item, index) =>
                                    <li className="nav-item" key={index} title={item.description}>
                                        <NavLink to={item.path} className="nav-link" >
                                            {item.title}
                                        </NavLink>
                                    </li>
                                )}
                                <li className="nav-item" title="Вихід з панелі куерування">
                                    <NavLink to="/access/logout" className="nav-link">
                                        Вихід
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="d-none d-xl-block text-light"
                        title={user.role.title + ' ' + user.description}>
                        {user.title}
                        {user.image ? (
                            <img src={config.images.url + '/' + user.image}
                                height="36px" className="rounded-3 ms-3" />
                        ) : null}
                    </div>
                </div>
            </nav>
        </header>
    )
}

Header.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string
    })),
    user: PropTypes.shape({
        role: PropTypes.shape({
            title: PropTypes.string.isRequired
        }).isRequired,
        description: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string
    }).isRequired
}

export default Header