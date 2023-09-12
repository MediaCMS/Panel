import React, { useEffect, useContext } from 'react'
import { Form } from 'react-bootstrap'
import Context from './Context.js'

export default function (props) {

    const data = useContext(Context)

    const handleChange = event => {
        if (props?.onChange) {
            props?.onChange(event)
        } else {
            data.set(
                event.target.name, 
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
            )
        }
    }

    const handleBlur = event => {
        if (props?.onBlur) props?.onBlur(event)
        if ((props.type === 'textarea') && event.target.value.length) {
            if (props?.pattern) {
                if (event.target.value.match(props.pattern)) {
                    event.target.setCustomValidity('')
                } else {
                    event.target.setCustomValidity(
                        props?.title ?? 'Невірний формат'
                    )
                }
            }
        } else {
            event.target.setCustomValidity('')
        }
        event.target.reportValidity()
    }

    useEffect(async () => {
        if ('value' in props) {
            data.set(props.name, props.value, false)
        }
    }, [])

    switch(props.type) {
        case 'radio':
        case 'switch':
        case 'checkbox':
            return <Form.Check {...props}
                checked={data.get(props.name) ?? false}
                onChange={handleChange} />
        case 'select':
            return <Form.Select {...props}
                value={data.get(props.name)}
                onChange={handleChange}>
                {props?.children}
            </Form.Select>
        case 'textarea':
            return <Form.Control as="textarea" {...props}
                value={data.get(props.name)}
                onChange={handleChange}
                onBlur={handleBlur} />
        default: {
            return <Form.Control
                autoComplete="off" {...props}
                value={data.get(props.name) ?? ''}
                onChange={handleChange}
                onBlur={handleBlur} />
        }
    }
}