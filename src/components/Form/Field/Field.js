import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

export default function (props) {

    const { className, label, ...propsNew } = props

    return (
        <Form.Group className={props?.className}>
            <Form.Label>{props.label}</Form.Label>
            {props?.type
                ? <Control {...propsNew}>{props?.children}</Control>
                :  props.children}
        </Form.Group>
    )
}