import React, { useState, useEffect, useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Context from '../../Context.js'

export default function (props) {

    const [value, setValue] = useState()
    const [prompt, setPrompt] = useState('')
    const [items, setItems] = useState([])
    const contextForm = useContext(Context)
    const contextOutlet = useOutletContext()

    const handleFocus = async event => {
        if (event.target.value !== value.title) return
        event.target.placeholder = value.title
        setPrompt('')
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
        console.log(params)
        const items = await contextOutlet.api.panel.get(props.path, { params })
        setItems(items)
    }

    const handleClick = async event => {
        contextForm.onChange(props.name, event.target.id)
        setValue({
            _id: event.target.id,
            title: event.target.innerHTML
        })
        setItems([])
    }

    const handleBlur = async event => {
        if (event.target.value === value.title) return
        setPrompt(value.title)
        setItems([])
    }

    useEffect(async () => {
        if (!props?.value) return
        const value = await contextOutlet.api.panel.get(props.path + '/' + props.value)
        setValue({ _id: value._id, title: value.title })
    }, [props.value])

    useEffect(async () => {
        if (!value) return
        setPrompt(value.title)
    }, [value])

    return (
        <Form.Group className={'autocomplete single dropdown ' + (props?.className ?? '')}>
            <Form.Label>{props.label ?? 'Автозаповнення'}</Form.Label>
            <Form.Control type="text" name="prompt" value={prompt}
                pattern={props.pattern ?? '.{1,128}'} autoComplete="off"
                onFocus={handleFocus} onChange={handleChange} onBlur={handleBlur}
                title={props.title ?? 'Введіть початкові символи для пошуку'} />
            {!!items.length && (
                <ul className="dropdown-menu show">
                    {items.map(item => (
                        <li key={item._id} className="dropdown-item" onMouseDown={handleClick}
                                id={item._id}>{item.title}
                        </li>
                    ))}
                </ul>
            )}
        </Form.Group>
    )
}