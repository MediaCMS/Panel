import React from 'react'
import Editor from '../Editor.js'

export default props => {

    return <Editor tag="address" value={props?.text}
        valid="p" multiline={true} newline="block"
        onChange={value => props.onChange('text', value)} />
}