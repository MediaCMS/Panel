/* global structuredClone */
import PropTypes from 'prop-types'
import React,  { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import config from '../../config.js'

const initTemplate = {
    menubar: false, width: '100%', height: '600px', resize: true, ui_mode: 'split',
    plugins: ['charmap', 'code', 'codesample', 'link', 'nonbreaking', 'visualchars'],
    toolbar: 'bold italic underline strikethrough | subscript superscript' +
        '| link | nonbreaking charmap | visualchars code',
    bold: { inline: 'span', 'classes': 'bold' },
    italic: { inline: 'span', 'classes': 'italic' },
    underline: { inline: 'span', 'classes': 'underline', exact: true },
    strikethrough: { inline: 'del' },
    valid_elements: 'a[href|title|rel],strong,em,s,sup,sub,span[style]',
    link_target_list: false,
    paste_as_text: true,
    formats: {
        alignleft: { selector: 'table,tr,td,th', classes: 'left' },
        aligncenter: { selector: 'table,tr,td,th', classes: 'center' },
        alignright: { selector: 'table,tr,td,th', classes: 'right' },
        alignjustify: { selector: 'table,tr,td,th', classes: 'justify' }
    },  
    link_rel_list: [
        { title: 'No Follow', value: 'nofollow' },
        { title: 'No Referrer', value: 'noreferrer' },
        { title: 'External Link', value: 'external' },
        { title: 'Empty' }
    ]
}

const EditorWrapper = props => {

    const [init, setInit] = useState(false)
    const [callbacks] = useState([
        editor => {
            editor.on('init', () => {
                const original = editor.windowManager.open
                editor.windowManager.open = (dialog, params) => {
                    if (dialog.title === 'Insert/Edit Link') {
                        if (!dialog.initialData.anchor) {
                            dialog.initialData.rel = 'nofollow'
                        }
                        dialog.body.items.splice(1, 1)
                    }
                    return original.apply(this, [dialog, params])
                }
                if (props?.setEditor) props.setEditor(editor)
                editor.dom.addClass(editor.dom.getRoot(), 'editable')
                if (props?.class) {
                    props.class.split(' ').forEach(className => 
                        editor.dom.addClass(editor.dom.getRoot(), className)
                    )
                }
                if (!props?.value) {
                    editor.dom.getRoot().focus()
                }
            })
        }
    ])

    const handleChange = (newValue, editor) => {
        props.onChange(newValue, editor)
    }

    useEffect(() => {
        const initNew = structuredClone(initTemplate)
        const callbacksNew = [...callbacks]
        if (props?.plugins) {
            if (props?.reset) {
                initNew.plugins = props.plugins
            } else {
                Array.isArray(props.plugins)
                    ? initNew.plugins.push(...props.plugins)
                    : initNew.plugins.push(props.plugins)
            }
        }
        if (props?.toolbar) {
            if (props?.reset) {
                initNew.toolbar = props.toolbar
            } else {
                initNew.toolbar += ' | ' + props.toolbar
            }
        }
        if (props?.valid) {
            initNew.valid_elements += ',' + (Array.isArray(props.valid)
                ? props.valid.join() : props.valid)
        }
        if (props?.newline) {
            initNew.newline_behavior = props.newline
        }
        if (!props?.multiline) {
            callbacksNew.push(editor => {
                editor.on('keydown', event => {
                    if (props?.onEnter) {
                        props.onEnter(event)
                    }
                })
            })
        }
        if (props?.callback) {
            callbacksNew.push(props.callback)
        }
        initNew.setup = editor => {
            callbacksNew.forEach(callback => callback(editor))
        }
        setInit(initNew)
    }, [])

    return init && <Editor tagName={props.tag ?? 'div'} value={props.value}
        init={init} inline={true} onEditorChange={handleChange}
        tinymceScriptSrc={config.tinymce} autoFocus />
}

EditorWrapper.propTypes = {
    setEditor: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    plugins: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    toolbar: PropTypes.string,
    valid: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    newline: PropTypes.string,
    multiline: PropTypes.bool,
    callback: PropTypes.func,
    onEnter: PropTypes.func,
    tag: PropTypes.string,
    value: PropTypes.string,
    reset: PropTypes.bool,
    class: PropTypes.string
}

export default EditorWrapper