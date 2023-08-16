import React from 'react'
import Single from './Autocomplete/Single.js'
import Multiple from './Autocomplete/Multiple.js'

export default function (props) {

    return props?.multiple 
        ? <Multiple {...props} />
        : <Single {...props} />
}