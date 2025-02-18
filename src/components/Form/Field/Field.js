import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

const Field = props => {

    // eslint-disable-next-line no-unused-vars
    const { className, label, ...propsNew } = props

    return (
        <Form.Group className={'field ' + (props.className || '')}>
            {props?.label && <Form.Label>{props.label}</Form.Label>}
            {props?.type
                ? <Control {...propsNew}>{props?.children}</Control>
                : props.children}
        </Form.Group>
    )
}

Field.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node
}

export default Field