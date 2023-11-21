import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import config from '../../config.js'

export default function (props) {

    const context = useOutletContext()

    const handleChange = event => {
        if (!event.target.files.length) return
        const file = event.target.files[0]
        if (!(file.type in config.images.types)) {
            event.target.value = null
            context.setAlert(`Заборонений тип файлу зображення`)
            return
        }
        if (file.size > config.images.size) {
            event.target.value = null
            context.setAlert(`Розмір файлу зображення більше дозволеного`)
            return
        }
        props.onChange(file)
    }

    return (props?.id && props?.slug)
        ? <img src={config.images.url + '/' + props.slug}
            className="d-block mw-100" />
        : <Form.Control type="file" onChange={handleChange}
            title="Виберіть зображення для завантаження"
            required={props.required ?? false} />
    
}
