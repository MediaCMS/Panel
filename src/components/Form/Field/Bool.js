import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

export default props => {

    const { className, label, title, ...propsNew } = { ...props }

    return <Form.Group className={props.className} title={props?.title}>
        <Form.Label>{props.label}</Form.Label>
        <Control type="switch" className="mt-2" value={false} {...propsNew} />
    </Form.Group>
}