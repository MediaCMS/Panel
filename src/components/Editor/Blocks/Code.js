import React, { useState, useEffect } from 'react'
import hljs from 'highlight.js'
import config from '../../../config.js'
import 'highlight.js/styles/androidstudio.css'

export default props => {

    const [text, setText] = useState()
    const [editable, setEditable] = useState(false)

    const handleChangeText = event => {
        props.onChange('text', event.target.textContent)
        setEditable(false)
    }

    useEffect( () => {
        if (!props?.text) setEditable(true)
        if (!props?.language) {
            props.onChange('language', 'auto')
        }
    }, [])

    useEffect(() => {
        const languages = {
            value: 'auto', label: 'Мови', variant: 'secondary',
            submenu: {
                auto: { label: 'Auto' }
            },
            event: value => props.onChange('language', value)
        }
        Object.entries(config.highlight.languages.list)
        .slice(0, config.highlight.languages.count)
        .forEach(([key, label]) =>
            languages.submenu[key] = { label }
        )
        languages.submenu.other = {
            label: 'Інші', divider: true, submenu: {}
        }
        Object.entries(config.highlight.languages.list)
        .slice(config.highlight.languages.count)
        .forEach(([key, label]) =>
            languages.submenu.other.submenu[key] = { label }
        )
        props.menu.dispatch(
            props.menu.actions.insert(
                'languages', languages
            )
        )
    }, [])

    useEffect( () => {
        if (!('text' in props)) return
        if (props.text.length) {
            const text = props?.language === 'auto'
                ? hljs.highlightAuto(props.text).value
                : hljs.highlight(props.text, {
                    language: props.language
                }).value
            setText(text)
        } else {
            setText('')
        }
    }, [props.text, props.language])

    useEffect( () => {
        if (!props?.language) return
        props.menu.dispatch(
            props.menu.actions.update(
                'languages', { value: props.language }
            )
        )
    }, [props.language])

    return editable
        ? <pre contentEditable="true" suppressContentEditableWarning="true"
            className="code editable" onBlur={handleChangeText}
            dangerouslySetInnerHTML={{ __html: props.text }} />
        : <pre data-size={props?.size} onClick={() => setEditable(true)}>
            <code className="hljs" dangerouslySetInnerHTML={{ __html: text }} />
        </pre>
}