import React, { useContext } from 'react'
import translit from 'ua-en-translit'
import Context from '../Context.js'
import Field from './Field.js'

export default function (props) {

    const name = 'slug'
    const context = useContext(Context)

    const handleChange = event => {
        if (!props?.source || event.target.value) return
        const value = translit(props.source.toLowerCase())
            .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-')
        context.onChange(props.name ?? name, value)
    }

    return <Field type="text" name={name}
        onFocus={handleChange} onBlur={handleChange} label="Посилання"
        pattern="[a-z0-9\-]{1,128}" placeholder="відносне-посилання"
        title="Посилання (від 1 до 128 прописних букв, цифр або дефісів)"
        {...props} />
}
