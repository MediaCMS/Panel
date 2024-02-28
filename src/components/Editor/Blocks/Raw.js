import React from 'react'

export default props => {

    return <pre contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => props.onChange('text', event.target.textContent)}>
        {props.text}
    </pre>
}