import React from 'react'

export default props => {

    return <pre contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => props.onChange('text', event.target.textContent)}
        onPaste={props.onPaste} className="editable">
        {props.text}
    </pre>
}