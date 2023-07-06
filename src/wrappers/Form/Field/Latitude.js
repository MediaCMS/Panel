import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="number" name="latitude" label="Широта"
        min="-90" max="90" step="0.0000001" className="text-end"
        placeholder="0.0000000" title="Від -90 до 90 градусів"
        {...props} />
}