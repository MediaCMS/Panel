'use strict'

import React from 'react'

export default function (props) {

    const handleChange = event => {
        props.blocks.dispatch(
            props.blocks.actions.update(
                props.id, { text: event.target.innerHTML }
            )
        )
    }

    return (
        <p onBlur={handleChange}
            contentEditable="true"
            suppressContentEditableWarning="true">
            {props.text}
        </p>
    )
}