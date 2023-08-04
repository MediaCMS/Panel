import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Context from '../../Context.js'

export default function (props) {

    const [prompt, setPrompt] = useState('')
    const [items, setItems] = useState([])
    const contextForm = useContext(Context)
    const contextOutlet = useOutletContext()
    const ref = useRef()

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
        if (props.value.length) {
            params._exclude = props.value.map(v => v._id).join()
        }
        const items = await contextOutlet.api.panel.get(props.path, { params })
        setItems(items)
    }

    const handleClick = event => {
        contextForm.onChange(props.name, [ ...props.value, {
            _id: event.target.id,
            title: event.target.innerHTML
        }])
        event.preventDefault()
    }

    const handleDelete = event => {
        const value = props.value.filter(v => v._id !== event.target.id)
        contextForm.onChange(props.name, value)
    }

    const handleBlur = () => {
        setItems([])
        setPrompt('')
    }

    useEffect(() => {
        if (props?.required) {
            console.log(ref.current.required, props.value)
            ref.current.required = Array.isArray(props.value)
                && props.value.length ? false : true
            console.log(ref.current.required)
        }
    }, [props.value])

    return (
        <Form.Group style={{padding: '0 -0.25rem'}}
            className={'autocomplete multiple dropdown ' + (props?.className ?? '')}>
            <Form.Label className="d-block">{props.label ?? 'Автозаповнення'}</Form.Label>
            <Form.Control type="text" name="prompt" value={prompt} pattern={props.pattern ?? '.{1,10}'}
                onChange={handleChange} onBlur={handleBlur} ref={ref} autoComplete="off"
                title={props.title ?? 'Введіть символи для пошуку'}
                className="m-1 d-inline" style={{ width: '120px' }} />
            {!!items.length && (
                <ul className="dropdown-menu show mx-1">
                    {items.map(item => (
                        <li key={item._id} className="dropdown-item" onMouseDown={handleClick}
                            id={item._id}>{item.title}
                        </li>
                    ))}
                </ul>
            )}
            {props?.value &&
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