import PropTypes from 'prop-types'
import React from 'react'
import Editor from '../Editor.js'

const Address = ({ text, onChange }) => {

    return <Editor tag="address" value={text}
        valid="p" multiline={true} newline="block"
        onChange={value => onChange('text', value)} />
}

Address.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func.isRequired
}

export default Address