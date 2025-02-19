import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

const Raw = ({ text, onChange, onPaste }) => {

    const ref = useRef()

    useEffect(() => {
        if (!text) ref.current.focus()
    }, [ref.current])

    return <pre contentEditable="true" suppressContentEditableWarning="true"
        onBlur={event => onChange('text', event.target.textContent)}
        onPaste={onPaste} className="editable" ref={ref}>
        {text}
    </pre>
}

Raw.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired,
}

export default Raw