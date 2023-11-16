import React from 'react'
import { useOutletContext, NavLink } from 'react-router-dom'

export default function (props) {

    const context = useOutletContext()

    return (
        <ul className="nav">
            {props?.items && props.items.map(item => (
                <li className="nav-item" key={item.title}>
                    <NavLink to={item.path ?? '#'}
                        onClick={() => {
                            if (item?.onClick) {
                                if (item?.confirm) {
                                    if (!context.setConfirm(item.description + '?')) {
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
                </li>))
            }
        </ul>
    )
}