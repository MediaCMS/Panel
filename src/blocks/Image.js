import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../components/Form.js'
import Image from '../components/Form/Field/Image.js'

export default function (props) {

    const [image, setImage] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (image?._id) {
            await context.api.panel.put('/images/' + image._id, image)
        } else {
            await context.api.panel.post('/images', image)
        }
        if (props?.onChange) props.onChange()
        props.onHide()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/images/' + image._id)
        props.onChange()
        props.onHide()
        setImage({})
    }

    useEffect(async () => {
        props?.id && setImage(
            await context.api.panel.get('/images/' + props.id)
        )
    }, [props.id])

    useEffect(async () => {
        props?.name && setImage(
            (await context.api.panel.get('/images', {
                params: { name: props.name }}
            ))[0] ?? { name: props.name }
        )
    }, [props.name])

    return (
        <Form {...props} data={image} onChange={setImage} size="lg" 
            onSubmit={handleSubmit} onDelete={handleDelete} as="modal">
            <Row>
                <Image name="name" label="Файл зображення" required />
            </Row>
            <Row>
                <Field.Title label="Заголовок зображення" required
                    placeholder="Основна інформація" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple required />
            </Row>
        </Form>
    )
}