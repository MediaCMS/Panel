import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="number" name="longitude" label="Довгота"
        min="-180" max="180" step="0.0000001" className="text-end"
        title="Від -180 до 180 градусів" placeholder="0.0000000"
        {...props} />
}