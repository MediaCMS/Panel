import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="text" name="image" pattern=".{2,128}" label="Зображення"
        placeholder="/x/y/z/zyzqwertyuioplkjhgfdsazxcvbnm.320.jpg"
        title="Зображення (від 2 до 128 символів)" {...props} />
}
