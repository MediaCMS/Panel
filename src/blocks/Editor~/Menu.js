'use strict'

import { Button, ButtonGroup, Dropdown } from 'react-bootstrap'
import React from 'react'

export default function (props) {

    return (
        <div className="menu position-absolute top-0 end-0">
            <ButtonGroup>{
                props.items.map(item => {
                    const variant = 'outline-' + (item.variant ?? 'secondary')
                    return item?.submenu
                        ? <Dropdown as={ButtonGroup} style={{ bacgroundColor: 'white' }} key={item.name}>
                            <Dropdown.Toggle variant={variant}>{item.name}</Dropdown.Toggle>
                            <Dropdown.Menu align="end" renderOnMount={true} style={{ minWidth: 'auto' }}>
                                {item.submenu.map(subItem =>
                                    <Dropdown.Item
                                        onClick={() => subItem?.event
                                            ? subItem.event()
                                            : item.event(props.id, subItem.value)}
                                        className={subItem?.active ? 'active' : ''}
                                        key={subItem.value}>
                                        {subItem.name}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    :   <Button onClick={() => item.event(props.id, item.value)}
                            variant={variant} key={item.name}>
                            {item.name}
                        </Button>
                })
            }</ButtonGroup>
        </div>
    )
}