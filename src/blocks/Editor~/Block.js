'use strict'

import React, { useState } from 'react'
import Menu from './Menu.js'

export default function (props) {

    const [isActive, setActive] = useState(false)
    const [menu, setMenu] = useState(props.menu)

    return (
        <div
            data-type={props.type}
            data-id={props.id}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            className="block border-bottom position-relative"
            style={{ border: 'solid 1px transparent' }}>
            {React.createElement(props.component, { ...props, onChangeMenu: setMenu }, null)}
            {isActive ?
                (<span className="fs-6 text-capitalize opacity-25 position-absolute"
                    style={{top: '5px', left: '8px', zIndex: 3}}>
                    <em>{props.type}</em>
                </span>)
                : null}
            {isActive ? <Menu items={menu} id={props.id} /> : null}
        </div>
    )
}