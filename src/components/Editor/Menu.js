import PropTypes from 'prop-types'
import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Dropdown from './Menu/Dropdown.js'

const Menu = ({ items, id }) => {

    return <div className="menu position-absolute top-0 end-0">
        <ButtonGroup>{
            Object.entries(items).map(([name, item]) => {
                const variant = 'outline-' + (item.variant ?? 'secondary')
                return item?.submenu
                    ?   <Dropdown id={id} {...item}
                            variant={item.variant ? variant : ''} key={name} />
                    :   <Button onClick={() => item.event(name, id)}
                            variant={variant} key={name}>
                            {item.label}
                        </Button>
            })
        }</ButtonGroup>
    </div>
}

Menu.propTypes = {
    items: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
}

export default Menu