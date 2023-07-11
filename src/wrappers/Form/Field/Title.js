import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="text" name="title" pattern=".{3,128}" label="Назва"
        placeholder="Назва" title="Назва (від 3 до 128 символів)" {...props} />
}
