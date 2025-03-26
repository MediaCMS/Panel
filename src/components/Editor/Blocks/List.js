import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import Editor from '../Editor.js'

const List = ({ text, order, size, menu, onChange }) => {

    const [editor, setEditor] = useState()

    useEffect( () => {
        menu.dispatch(
            menu.actions.insert(
                'resize', menu.resize
            )
        )
        size || onChange('size', 'medium')
    }, [])

    useEffect(() => {
        menu.dispatch(
            menu.actions.insert(
                'order', {
                    value: false, label: 'Сортування', variant: 'secondary',
                    event: value => onChange('order', value),
                    submenu: {
                        numered: { label: 'Нумероване', value: true },
                        arbitrary: { label: 'Довільне', value: false }
                    }
                }
            )
        )
        order || onChange('order', false)
    }, [])

    useEffect( () => {
        if (!editor) return
        editor.getBody().dataset.size = size
    }, [editor, size])

    useEffect(() => {
        if (!order) return
        menu.dispatch(
            menu.actions.update('order', {
                value: order
            })
        )
    }, [order])

    return <Editor tag={order ? 'ol' : 'ul'} value={text} plugins="lists"
        valid="li" multiline={true} size={size} setEditor={setEditor}
        onChange={value => onChange('text', value)} />
}

List.propTypes = {
    text: PropTypes.string.isRequired,
    order: PropTypes.bool,
    size: PropTypes.string,
    menu: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default List