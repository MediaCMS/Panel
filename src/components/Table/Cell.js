import React from 'react'
import PropTypes from 'prop-types'

const Cell = props => {

    return props?.scope ? (  
        <th className="text-center" {...props}>{props.children}</th>
    ) : (
        <td className="text-center" {...props}>{props.children}</td>
    )
}

Cell.propTypes = {
    children: PropTypes.node,
    scope: PropTypes.string
}

export default Cell