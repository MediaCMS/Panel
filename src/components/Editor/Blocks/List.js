import React, { useState, useEffect } from 'react'
import Editor from '../Editor.js'

export default props => {

    const [editor, setEditor] = useState()

    useEffect( () => {
        props.menu.dispatch(
            props.menu.actions.insert(
                'resize', props.menu.resize
            )
        )
        if (!props?.size) {
            props.onChange('size', 'full')
        }
    }, [])

    useEffect( () => {
        if (!editor) return
        editor.getBody().dataset.size = props.size
    }, [editor, props.size])

    return <Editor tag="ul" value={props?.text} plugins="lists"
        valid="li" multiline={true} size={props.size} setEditor={setEditor}
        onChange={value => props.onChange('text', value)} />
}