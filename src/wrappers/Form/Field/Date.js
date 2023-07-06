import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="date" name="date" label="Дата" 
        {...props} />
}