import React from 'react'
import Field from './Field.js'

export default function (props) {

    return (
        <Field type="textarea" name="description" pattern=".{3,256}" label="Опис"
            placeholder="Опис" title="Від 3 до 256 символів" rows="3"
            {...props} />
    )
}