import React from 'react'

export default props => {

    return <h2 contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => props.onChange('text', event.target.textContent)}
        onKeyDown={event => (event.key === 'Enter') && event.preventDefault()}>
        {props.text}
    </h2>
}
