import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Dropdown, ButtonGroup } from 'react-bootstrap'

const DropdownWrapper = ({ variant, label, submenu, id, event, value }) => {

    const [show, setShow] = useState(false)

    return <Dropdown as={ButtonGroup} show={show} drop="down"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <Dropdown.Toggle variant={variant ?? 'none'}>
            {label}
        </Dropdown.Toggle>
        <Dropdown.Menu align="start" renderOnMount={true} style={{ minWidth: 'auto' }}>
            {Object.entries(submenu).map(([name, item]) => {
                const result = [], valueItem = item.value ?? name;
                if (item?.divider) {
                    result.push(<Dropdown.Divider key={name + 'Divider'} />)
                }
                result.push(
                    <Dropdown.Item as="div"
                        onClick={
                            !item?.submenu
                                ? () => item?.event 
                                    ? item.event() 
                                    : event(valueItem, id)
                                : null
                        } className={
                            value && (valueItem === value) ? 'active' : ''
                        } key={name}>
                            {item?.submenu
                                ? <DropdownWrapper {...item}
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

DropdownWrapper.propTypes = {
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

export default DropdownWrapper