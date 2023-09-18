import React from 'react'
import { Row } from 'react-bootstrap'

export default function (props) {

    return (
        <Row className="mt-4" {...props}>{props?.children}</Row>
    )
}

