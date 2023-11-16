import React, { useState, useContext, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Context from '../../../contexts/Form.js'
import Show from './Image/Show.js'
import Choose from './Image/Choose.js'
import Field from './Field.js'

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
            {image?.slug
                ? <Show slug={image.slug} onChange={handleChange} />
                : <Choose onChange={handleChange} required={props.required}
                    setConfirm={context.setConfirm} />
            }
        </Field>
    )
}