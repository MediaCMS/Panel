import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import config from '../../../config.js'
import 'highlight.js/styles/androidstudio.css'

const Code = props => {

    const ref = useRef()
    const [text, setText] = useState()
    const [editable, setEditable] = useState(false)

    const handleChangeText = event => {
        props.onChange(
            'text', event.target.textContent
        )
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

    useEffect(() => {
        if (!('text' in props) && editable)
            ref.current.focus()
    }, [ref.current])

    return editable
        ? <pre contentEditable="true" suppressContentEditableWarning="true"
            className="code editable" onBlur={handleChangeText} onPaste={props.onPaste}
            dangerouslySetInnerHTML={{ __html: props.text }} key="1" ref={ref} />
        : <pre data-size={props?.size} onClick={() => setEditable(true)} key="2">
            <code className="hljs" dangerouslySetInnerHTML={{ __html: text }} />
        </pre>
}

Code.propTypes = {
    text: PropTypes.string,
    language: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired,
    menu: PropTypes.object.isRequired
}

export default Code