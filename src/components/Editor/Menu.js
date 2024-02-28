import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Dropdown from './Menu/Dropdown.js'

export default props => {

    return <div className="menu position-absolute top-0 end-0">
        <ButtonGroup>{
            Object.entries(props.items).map(([key, item]) => {
                const variant = 'outline-' + (item.variant ?? 'secondary')
                return item?.submenu
                    ?   <Dropdown id={props.id} {...item}
                            variant={item.variant ? variant : ''} key={key} />
                    :   <Button onClick={() => item.event(key, props.id)}
                            variant={variant} key={key}>
                            {item.label}
                        </Button>
            })
        }</ButtonGroup>
    </div>
}