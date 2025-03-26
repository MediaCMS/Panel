import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Editor from './Editor.js'

const Intro = ({text, onChange, onEnter, menu}) => {

    useEffect(() => {
        menu.dispatch(
            menu.actions.remove(['move', 'remove'])
        )
    }, [])

    return <Editor tag="p" class="intro" value={text}
        onChange={value => onChange('text', value)}
        onEnter={onEnter} title="Перший абзац" />
}

Intro.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func,
    menu: PropTypes.object.isRequired
}

export default Intro