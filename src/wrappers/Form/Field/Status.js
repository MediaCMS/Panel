import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="switch" name="status" label="Статус"
        title="Дозвіл на використання" className="mt-2" {...props} />
}