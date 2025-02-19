import PropTypes from 'prop-types'
import React from 'react'
import Editor from '../Editor.js'

const Text = ({ text, onChange, onEnter }) => {

    return <Editor tag="p" class="block2" value={text}
        onChange={value => onChange('text', value)}
        onEnter={onEnter} />
}

Text.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func
}

export default Text