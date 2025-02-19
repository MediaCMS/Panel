import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

const Header = ({ text, onChange, onEnter, onPaste }) => {

    const ref = useRef()

    useEffect(() => {
        if (!text) ref.current.focus()
    }, [ref.current])

    return <h2 contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => onChange('text', event.target.textContent)}
        onKeyDown={onEnter} onPaste={onPaste}
        className="editable" ref={ref}>
        {text}
    </h2>
}

Header.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func,
    onPaste: PropTypes.func
}

export default Header
