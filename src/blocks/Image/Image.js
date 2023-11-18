import React from 'react'
import { Form } from 'react-bootstrap'
import config from '../../config.js'

export default function (props) {

    const handleChange = event => {
        console.log(event.target.files)
        props.onChange(event.target.files[0])
    }

    return (props?.id && props?.slug)
        ? <img src={config.images.url + '/' + props.slug}
            className="mw-100" />
        : <Form.Control type="file" onChange={handleChange}
            title="Виберіть зображення для завантаження"
            required={props.required ?? false} />
    
}
