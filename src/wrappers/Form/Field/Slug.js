import React, { useEffect, useContext } from 'react'
import Context from '../Context.js'
import Field from './Field.js'

export default function (props) {

    const name = 'slug'
    const context = useContext(Context)

    const handleChange = event => {
        if (!props?.source || event.target.value) return
        const value = props.source.toLowerCase().replace(/\s/g, '-')
            .replace(/[^a-zа-яіїґє0-9\-]/g, '')
        context.onChange(props.name ?? name, value)
    }

    return <Field type="text" name={name}
        onFocus={handleChange} onBlur={handleChange} label="Посилання"
        pattern="[a-zа-яіїґє0-9\-]{2,64}" placeholder="відносне-посилання"
        title="Посилання (від 2 до 64 прописних букв, цифр або дефісів)"
        {...props} />
}
