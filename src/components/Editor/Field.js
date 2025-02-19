import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

const Field = props => {

    // eslint-disable-next-line no-unused-vars
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

Field.propTypes = {
    as: PropTypes.elementType,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool
}

export default Field