import React from 'react'
import Field from './Field.js'

export default function (props) {

    return (
        <Field type="textarea" name="body" pattern="." label="Текст"
            placeholder="Текст ..." rows="10"
            {...props} />
    )
}