import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Dropdown, ButtonGroup } from 'react-bootstrap'

const DropdownMenu = ({ variant, label, submenu, id, event, value }) => {

    const [show, setShow] = useState(false)

    return <Dropdown as={ButtonGroup} show={show} drop="down"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <Dropdown.Toggle variant={variant ?? 'none'}>
            {label}
        </Dropdown.Toggle>
        <Dropdown.Menu align="start" renderOnMount={true} style={{ minWidth: 'auto' }}>
            {Object.entries(submenu).map(([key, item]) => {
                const result = [];
                if (item?.divider) {
                    result.push(<Dropdown.Divider key={key + 'Divider'} />)
                }
                result.push(
                    <Dropdown.Item as="div"
                        onClick={
                            !item?.submenu
                                ? () => item?.event ? item.event() : event(key, id)
                                : null
                        } className={
                            value && (key === value) ? 'active' : ''
                        } key={key}>
                            {item?.submenu
                                ? <DropdownMenu {...item}
                                    id={id} value={value}
                                    event={item.event ?? event} />
                                : item.label}
                    </Dropdown.Item>
                )
                return result
            })}
        </Dropdown.Menu>
    </Dropdown>
}

DropdownMenu.propTypes = {
    variant: PropTypes.string,
    label: PropTypes.string.isRequired,
    submenu: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    event: PropTypes.func.isRequired,
    value: PropTypes.string
}

export { DropdownMenu as default }