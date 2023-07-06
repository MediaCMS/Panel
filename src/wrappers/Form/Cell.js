import React from 'react'
import { Col } from 'react-bootstrap'

export default function (props) {

    return (
        <Col {...props}>{props?.children}</Col>
    )
}

