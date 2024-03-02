import React from 'react'

export default props => {

    return <pre contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => props.onChange('text', event.target.textContent)}
        onPaste={props.onPaste}>
        {props.text}
    </pre>
}