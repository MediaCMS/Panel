import React from 'react'
import Field from './Field.js'

export default function (props) {

    return <Field type="text" name="uri" pattern="[а-яіїґє-]{3,64}"
        title="Від 3 до 64 прописних букв, цифр або дефісів"
        placeholder="відносне-посилання" label="Посилання"
        {...props} />
}
