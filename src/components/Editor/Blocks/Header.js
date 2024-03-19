import React, { useEffect, useRef } from 'react'

export default props => {

    const ref = useRef()

    useEffect(() => {
        if (!('text' in props)) ref.current.focus()
    }, [ref.current])

    return <h2 contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => props.onChange('text', event.target.textContent)}
        onKeyDown={props.onEnter} onPaste={props.onPaste}
        className="editable" ref={ref}>
        {props.text}
    </h2>
}
