'use strict'

import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'

const submenu = {
    sizes: [
        {name: 'Small', value: 'small'},
        {name: 'Medium', value: 'medium'},
        {name: 'Large', value: 'large'},
        {name: 'Full', value: 'full'}
    ]
}

export default function Video(props) {

    const handleResize = (id, size) => {
        props.blocks.dispatch(
            props.blocks.actions.update(id, { size })
        )
    }

    const handleSetVideoHash = event => {
        if (!event.target.value) return
        props.blocks.dispatch(
            props.blocks.actions.update(
                props.id, { hash: event.target.value, size: 'medium' }
            )
        )
    }

    useEffect(() => {
        if (!props?.hash) return
        const menu = [...props.menu]
        menu.splice(1, 0, {
            name: 'Resize', value: 'resize', event: handleResize,
            submenu: submenu.sizes.map(item => (
                (item.value === props.size) ? {...item, active: true} : item
            ))
        })
        props.onChangeMenu(menu)
    }, [props.menu])

    if (props?.hash) {
        return (
            <iframe
                src={'https://www.youtube.com/embed/' + props.hash}
                title="YouTube video player"
                className={props.size}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        )
    } else {
        return (
            <Form.Control type="text" placeholder="3JJyKWPKIcQ"
                onBlur={handleSetVideoHash} title="Set youtube video id and focus out"
                className="text-center my-5 mx-auto" style={{ maxWidth: '200px' }} />
        )
    }
}