import React from 'react'
import Editor from '../Editor.js'

export default props => {

    return <Editor tag="p" class="block2" value={props?.text}
        onChange={value => props.onChange('text', value)} />
}