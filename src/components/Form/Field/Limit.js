import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

const limits = [50, 100, 250, 500, 1000]

export default function (props) {

    const { className, label, ...propsNew } = {
        name: '_limit', ...props
    }

    return (
        <Form.Group className={props.className}>
            <Form.Label>{props.label ?? 'Обмеження'}</Form.Label>
            <Control type="select" {...propsNew}
                title="Обмеження на кількість рядків">
                {limits.map(limit =>
                    <option value={limit} key={limit}>{limit}</option>
                )}
            </Control>
        </Form.Group>
    )
}