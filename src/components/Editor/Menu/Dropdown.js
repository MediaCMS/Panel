import React, { useState } from 'react'
import { Dropdown, ButtonGroup } from 'react-bootstrap'

const DropdownWrapper = props => {

    const [show, setShow] = useState(false)

    return <Dropdown as={ButtonGroup} show={show} drop="down"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <Dropdown.Toggle variant={props.variant ?? 'none'}>
            {props.label}
        </Dropdown.Toggle>
        <Dropdown.Menu align="start" renderOnMount={true} style={{ minWidth: 'auto' }}>
            {Object.entries(props.submenu).map(([key, item]) => {
                const result = [];
                if (item?.divider) {
                    result.push(<Dropdown.Divider key={key + 'Divider'} />)
                }
                result.push(
                    <Dropdown.Item as="div"
                        onClick={
                            !item?.submenu
                                ? () => item?.event 
                                    ? item.event() 
                                    : props.event(key, props.id)
                                : null
                        } className={
                            props?.value && (key === props.value) ? 'active' : ''
                        } key={key}>
                            {item?.submenu
                                ? <DropdownWrapper {...item} 
                                    id={props.id} value={props?.value}
                                    event={item.event ?? props.event} />
                                : item.label}
                    </Dropdown.Item>
                )
                return result
            })}
        </Dropdown.Menu>
    </Dropdown>
}

export { DropdownWrapper as default }