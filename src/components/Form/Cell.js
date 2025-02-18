import PropTypes from 'prop-types'
import React from 'react'
import { Col } from 'react-bootstrap'

const Cell = props => {

    return (
        <Col {...props}>{props?.children}</Col>
    )
}

Cell.propTypes = {
    children: PropTypes.node
}

export default Cell