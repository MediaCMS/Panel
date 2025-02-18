import PropTypes from 'prop-types'
import React from 'react'
import Single from './Autocomplete/Single.js'
import Multiple from './Autocomplete/Multiple.js'
import '../../../assets/styles/components/fields/autocomplete.css'

const Autocomplete = props => {

    return props?.multiple 
        ? <Multiple {...props} />
        : <Single {...props} />
}

Autocomplete.propTypes = {
    multiple: PropTypes.bool
}

export default Autocomplete