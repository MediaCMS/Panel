import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="text" name="slug" pattern="[a-zа-яіїґє0-9-]{3,64}"
        title="Посилання (від 3 до 64 прописних букв, цифр або дефісів)"
        placeholder="відносне-посилання" label="Посилання"
        {...props} />
}
