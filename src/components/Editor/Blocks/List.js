import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import Editor from '../Editor.js'

const List = ({ text, size, menu, onChange }) => {

    const [editor, setEditor] = useState()

    useEffect( () => {
        menu.dispatch(
            menu.actions.insert(
                'resize', menu.resize
            )
        )
        if (!size) onChange('size', 'full')
    }, [])

    useEffect( () => {
        if (!editor) return
        editor.getBody().dataset.size = size
    }, [editor, size])

    return <Editor tag="ul" value={text} plugins="lists"
        valid="li" multiline={true} size={size} setEditor={setEditor}
        onChange={value => onChange('text', value)} />
}

List.propTypes = {
    text: PropTypes.string.isRequired,
    size: PropTypes.string,
    menu: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default List