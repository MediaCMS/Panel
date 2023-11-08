import React, { useState, useContext, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Field from './Field.js'
import Upload from './Image/Upload.js'
import Choose from './Image/Choose.js'
import '../../../assets/styles/components/fields/image.css'
import Context from '../../../contexts/Form.js'

export default function (props) {

    const [image, setImage] = useState({})
    const context = useOutletContext()
    const data = useContext(Context)
    const name = props?.name ?? 'image'
    const value = data.get(name)

    const handleChange = value => {
        data.set(name, value)
    }

    useEffect(async () => {
        setImage(
            value ? await context.api.panel.get('/images/' + value) : {}
        )
    }, [value])

    return (
        <Field label={props?.label ?? 'Зображення'}>
            {props?.as && (props.as === 'upload')
                ? <Upload {...props} image={image} />
                : <Choose {...props} image={image} onChange={handleChange} />}
        </Field>
    )
}