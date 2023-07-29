import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

export default function (props) {

    const { className, label, ...propsNew } = props

    return (
        <Form.Group className={props?.className}>
            <Form.Label>{props.label ?? 'Статус'}</Form.Label>
            <Control type="switch" name="status" className="mt-2"
                title="Дозвіл на використання" {...propsNew} />
        </Form.Group>
    )
}