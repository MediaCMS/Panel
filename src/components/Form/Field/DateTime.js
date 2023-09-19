import React, { useContext, useEffect } from 'react'
import Field from './Field.js'
import Context from '../../../contexts/Form.js'

export default function (props) {

    const data = useContext(Context)
    const name = props?.name ?? 'date'
    const value = data.get(name)

    const handleChange = event => {
         data.set(
            event.target.name, 
            new Date(event.target.value).toISOString()
        )
    }

    useEffect(async () => {
        if (value) return
        data.set(name, new Date().toISOString())
    }, [])

    return <Field type="datetime-local" name={name} label="Дата" {...props}
        onChange={handleChange} />
}