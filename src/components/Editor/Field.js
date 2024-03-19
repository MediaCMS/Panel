import React, { useEffect, useRef } from 'react'

export default props => {

    const { as, name, value, className, ...propsNew } = { ...props }
    const ref = useRef(null)

    const handleChange = event => {
        props.onChange(props.name, event.target.textContent.length
            ? event.target.textContent : undefined)
        ref.current.scrollLeft = 0
    }

    useEffect(() => {
        if (props?.autoFocus && !props?.value) {
            ref.current.focus()
        }
    }, [ref.current])

    return React.createElement(
        props.as ?? 'div', {
            contentEditable: "true",
            suppressContentEditableWarning: "true",
            className: 'editable ' + (props.className ?? props.name),
            onBlur: handleChange,
            onKeyDown: event => {
                if (event.key === 'Enter') event.preventDefault()
            },
            ref,
            ...propsNew
        }, props.value
    )
}