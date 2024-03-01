import React, { useState, useEffect } from 'react'
import Editor from '../Editor.js'

const tableTemplate = `<table>
    <tbody>
        <tr><td>11</td><td>12</td><td>13</td></tr>
        <tr><td>21</td><td>22</td><td>23</td></tr>
        <tr><td>31</td><td>32</td><td>33</td></tr>
    </tbody>
</table>`

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
        console.log(editor.getContent())
        const content = editor.getContent()
        const container = document.createElement('div');
        container.innerHTML = content;
        container.firstElementChild.dataset.size = props.size
        editor.setContent(container.innerHTML)
   }, [editor, props.size])

    return <Editor tag="div" value={props?.text ?? tableTemplate}
        valid={['table', 'thead', 'tbody', 'tfoot', 'tr', 'th[class]', 'td[class]']}
        toolbar="table align" plugins="table" setEditor={setEditor}
        onChange={
            value => props.onChange('text', value.replace(/\n+/g, ''))
        } />
}