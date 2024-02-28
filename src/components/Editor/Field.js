import React, { useRef } from 'react'

export default props => {

    const { as, name, value, ...propsNew } = { ...props }
    const ref = useRef(null)

    const handleChange = event => {
        props.onChange(props.name, event.target.textContent.length
            ? event.target.textContent : undefined)
        ref.current.scrollLeft = 0
    }

    return React.createElement(
        props.as ?? 'div', {
            contentEditable: "true",
            suppressContentEditableWarning: "true",
            className: 'field ' + props.name,
            onBlur: handleChange,
            onKeyDown: event => {
                if (event.key === 'Enter') event.preventDefault()
            },
            ref,
            ...propsNew
        }, props.value
    )
}