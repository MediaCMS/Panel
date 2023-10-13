import React, { useContext } from 'react'
import { Form } from 'react-bootstrap'
import Context from '../../../../contexts/Form.js'
import config from '../../../../config.js'

export default function (props) {

    const data = useContext(Context)
    const name = props?.name ?? 'image'
    const value = data.get(name)

    const handleChange = event => {
        props.onChange(event.target.files[0])
    }

    return value
        ? <img src={config.images.url + value} className="mw-100" />
        : <Form.Control type="file" onChange={handleChange}
            title="Виберіть зображення для завантаження"
            required={props.required ?? false} />
}
