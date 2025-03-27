import React from 'react'
import PropTypes from 'prop-types'

const Cell = props => {

    const { children, ...propsNew } = props
    return React.createElement(
        props?.scope ? 'th' : 'td',
        {
            className: 'text-center',
            ...propsNew,
            dangerouslySetInnerHTML: { __html: children}
        }
    )
}

Cell.propTypes = {
    children: PropTypes.node,
    scope: PropTypes.string
}

export default Cell