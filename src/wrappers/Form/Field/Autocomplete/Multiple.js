import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Context from '../../Context.js'

export default function (props) {

    const [prompt, setPrompt] = useState('')
    const [items, setItems] = useState([])
    const contextOutlet = useOutletContext()
    const contextForm = useContext(Context)
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
        const items = await contextOutlet.api.panel
            .get(props.path, { params })
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
            ref.current.required = Array.isArray(props.value)
                && props.value.length ? false : true
        }
    }, [props.value])

    return (
        <Form.Group className={
            'autocomplete multiple dropdown' + (props?.className ?? '')          
        }>
            <Form.Label className="d-block">
                {props.label ?? 'Автозаповнення'}
            </Form.Label>
            <div className="d-flex flex-wrap row-gap-3 column-gap-2">
                <div style={{ width: '120px' }}>
                    <Form.Control type="text" name="prompt" value={prompt} 
                        pattern={props.pattern ?? '.{1,10}'}
                        onChange={handleChange} onBlur={handleBlur}
                        title={props.title ?? 'Введіть символи для пошуку'}
                        autoComplete="off" ref={ref} />
                    {!!items.length && (
                        <ul className="dropdown-menu show">
                            {items.map(item => (
                                <li id={item._id} className="dropdown-item"
                                    onMouseDown={handleClick} key={item._id}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {props?.value &&
                    props.value.map(v =>
                        <Button onClick={handleDelete} variant="outline-dark"
                            title="Видалити" id={v._id} key={v._id}>
                            {v.title}
                        </Button>
                    )
                }
            </div>
        </Form.Group>
    )
    
}