'use strict'

import React from 'react'

export default function (props) {

    const handleChange = event => {
        props.blocks.dispatch(
            props.blocks.actions.update(
                props.id, { text: event.target.textContent }
            )
        )
    }

    return (
        <h2 onBlur={handleChange}
            contentEditable="true"
            suppressContentEditableWarning="true">
            {props.text}
        </h2>
    )
}
