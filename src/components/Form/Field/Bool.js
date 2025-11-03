import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

const Bool = props => {

    const { className, label, title, ...propsNew } = { ...props }

    return <Form.Group className={className} title={title}>
        <Form.Label>{label}</Form.Label>
        <Control type="switch" className="mt-2" value={false} {...propsNew} />
    </Form.Group>
}

Bool.propTypes = {
    title: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string
}

export default Bool