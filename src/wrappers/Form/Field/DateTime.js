import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="datetime-local" name="time" label="Час" 
        {...props} />
}