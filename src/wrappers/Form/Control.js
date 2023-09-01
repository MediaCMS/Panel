import React, { useEffect, useContext } from 'react'
import { Form } from 'react-bootstrap'
import Context from './Context.js'

export default function (propsDefault) {
console.log(propsDefault)
    const context = useContext(Context)
    const props = { ...propsDefault }

    if (context.data) {
        if (props.name in context.data) {
            props.value = context.data[props.name]
        }
    }

    const handleChange = event => {
        if (props?.onChange) {
            props?.onChange(event)
        } else {
            context.onChange(
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
            context.onChange(props.name, props.value)
        }
    }, [])

    switch(props.type) {
        case 'radio':
        case 'switch':
        case 'checkbox':
            return <Form.Check {...props}
                onChange={handleChange} checked={props.value ?? false} />
        case 'select':
            return <Form.Select {...props} onChange={handleChange}>
                {props?.children}
            </Form.Select>
        case 'textarea':
            return <Form.Control as="textarea" {...props}
                onChange={handleChange} onBlur={handleBlur} />
        case 'input': props.autoComplete = 'off'
        default: {
            return <Form.Control {...props} value={props.value ?? ''}
                onChange={handleChange} onBlur={handleBlur} />
        }
    }
}