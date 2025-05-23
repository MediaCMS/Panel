import PropTypes from 'prop-types'
import React from 'react'
import Editor from '../Editor.js'

const Text = ({ text, onChange, onEnter }) => {

    return <Editor value={text} class="text" valid="p" multiline
        onChange={value => onChange('text', value)}
        onEnter={onEnter} />

}

Text.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func
}

export default Text