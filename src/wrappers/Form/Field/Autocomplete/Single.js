import React, { useState, useEffect, useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Context from '../../Context.js'

export default function (props) {

    const [prompt, setPrompt] = useState('')
    const [items, setItems] = useState([])
    const [title, setTitle] = useState()
    const contextOutlet = useOutletContext()
    const contextForm = useContext(Context)

    const handleFocus = async event => {
        event.target.select()
    }

    const handleChange = async event => {
        setPrompt(event.target.value)
        if (event.target.value.length < 1) {
            setItems([])
            return
        }
        const params = {
            title: event.target.value,
            _compact: true,
            status: true
        }
        if (props?.value) {
            params._exclude = props.value
        }
        const items = await contextOutlet.api.panel
            .get(props.path, { params })
        setItems(items)
    }

    const handleClick = async event => {
        contextForm.onChange(props.name, event.target.id)
        setTitle({
            _id: event.target.id,
            title: event.target.innerHTML
        })
        setItems([])
    }

    const handleBlur = async event => {
        if (event.target.value === title) return
        if (event.target.value.length) {
            setPrompt(title)
        } else {
            contextForm.onChange(props.name, null)
            setPrompt('')
            setTitle('')
        }
        setItems([])
    }

    useEffect(async () => {
        if (!props?.value) return
        const value = await contextOutlet.api.panel
            .get(props.path + '/' + props.value)
        setTitle(value.title)
    }, [props.value])

    useEffect(async () => {
        if (!title) return
        setPrompt(title)
    }, [title])

    return (
        <Form.Group className={
            'autocomplete single dropdown' + (props?.className ?? '')
        }>
            <Form.Label className="d-block">
                {props.label ?? 'Автозаповнення'}
            </Form.Label>
            <Form.Control type="text" name="prompt" value={prompt}
                pattern={props.pattern ?? '.{1,128}'} onChange={handleChange}
                onFocus={handleFocus} onBlur={handleBlur} autoComplete="off"
                title={props.title ?? 'Введіть символи для пошуку'}
                required={!!props?.required} />
            {!!items.length && (
                <ul className="dropdown-menu show">
                    {items.map(item => (
                        <li className="dropdown-item" onMouseDown={handleClick}
                            id={item._id} key={item._id}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            )}
        </Form.Group>
    )
}