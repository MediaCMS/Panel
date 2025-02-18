import PropTypes from 'prop-types'
import React from 'react'
import { Row } from 'react-bootstrap'

const RowWrapper = props => {

    return (
        <Row className="mt-4" {...props}>{props?.children}</Row>
    )
}

RowWrapper.propTypes = {
    children: PropTypes.node
}

export default RowWrapper