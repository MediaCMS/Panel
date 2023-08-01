import React, { useState, useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Control from '../Control.js'
import Context from '../Context.js'

export default function (props) {

    const [prompt, setPrompt] = useState(props.multiple ? '' : props.value.title)
    const [items, setItems] = useState([])
    const contextForm = useContext(Context)
    const contextOutlet = useOutletContext()

    const handleChange = async event => {
        setPrompt(event.target.value)
        if (event.target.value.length < 1) return
        const params = {
            prompt: event.target.value,
        }
        if (props?.value.length) {
            params.exclude = props.value.map(v => v._id).join()
        }
        const items = await contextOutlet.api.panel.get(props.path, { params })
        setItems(items)
    }

    const handleClick = async event => {
        contextForm.onChange(props.name, [ ...props.value, {
            _id: event.target.id,
            title: event.target.innerHTML
        }])
        setPrompt('')
        setItems([])
    }

    const handleDelete = async event => {
        const value = props.value.filter(v => v._id !== event.target.id)
        contextForm.onChange(props.name, value)
}

    return (
        <Form.Group className={'autocomplete dropdown ' + (props?.className ?? '')} style={{padding: '0 -0.25rem'}}>
            <Form.Label className="d-block">{props.label ?? 'Автозаповнення'}</Form.Label>
            <Control type="text" name="prompt" value={prompt}
                pattern={props.pattern ?? '.{1,10}'} onChange={handleChange}
                title={props.title ?? 'Введіть початкові символи для пошуку'}
                className="col-4 w-auto m-1 d-inline" />
            {!!items.length && (
                <ul className="dropdown-menu show mx-1">
                    {items.map(item => (
                        <li key={item._id} className="dropdown-item" onClick={handleClick}
                                id={item._id}>{item.title}
                        </li>
                    ))}
                </ul>
            )}
            {props?.multiple && props?.value &&
                props.value.map(v =>
                    <Button onClick={handleDelete} variant="outline-dark"
                        className="m-1" id={v._id} key={v._id}
                        title="Видалити">
                        {v.title}
                    </Button>
                )
            }
        </Form.Group>
    )
}