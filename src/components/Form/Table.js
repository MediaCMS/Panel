import React from 'react'
import PropTypes from 'prop-types'

const sizes = { small: '480px', medium: '640px', large: '960px' }

const Table = props => {

    return <div className="mt-5 mx-auto"
        style={{ maxWidth: sizes[props.size] }} {...props}>
        {props?.children}
    </div>

}

Table.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    children: PropTypes.node
}

export default Table