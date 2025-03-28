import PropTypes from 'prop-types'
import React from 'react'

const Row = ({
    title, status, className, onClick, children
}) => {

    const classNameNew = []

    if (className) {
        classNameNew.push(className)
    }

    if ((typeof status !== 'undefined')
            && (status === false)) {
        classNameNew.push('text-muted')
    }

    return (
        <tr onClick={onClick} title={title}
            className={classNameNew}>
            {children}
        </tr>
    )
}

Row.propTypes = {
    title: PropTypes.string,
    status: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node
}

export default Row