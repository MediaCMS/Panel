import React, { useContext } from 'react'
import { transliterate } from '../../../utils.js'
import Context from '../../../contexts/Form.js'
import Field from './Field.js'

export default function (props) {

    const name = props.name ?? 'slug'
    const data = useContext(Context)

    const handleChange = event => {
        if (!props?.source || event.target.value) return
        data.set(name, transliterate(props.source))
    }

    return <Field type="text" name={name}
        onFocus={handleChange} onBlur={handleChange} label="Посилання"
        pattern="[a-z0-9\-]{1,128}" placeholder="відносне-посилання"
        title="Посилання (від 1 до 128 прописних латинських букв, цифр та дефісів)"
        {...props} />
}
