import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="text" name="title" pattern=".{3,64}" label="Назва"
         title="від 3 до 64 символів" placeholder="Найменування"
        {...props} />
}
