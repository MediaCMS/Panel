import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../components/Form.js'
import Image from './Image/Image.js'
//import Slug from './Image/Slug.js'

export default function (props) {

    const [gallery, setGallery] = useState({})
    const [file, setFile] = useState({})
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (gallery?._id) {
            if (gallery.slug !== slug) {
                await context.api.image.patch(slug, { slug: image.slug })
            }
            await context.api.panel.put('/images/' + image._id, image)
        } else {
            const formData = new FormData()
            formData.append('image', file)
            await context.api.image.post(image.slug, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }}
            )
            await context.api.panel.post('/images', image)
        }
        handleClose()
    }

    const handleDelete = async () => {
        await context.api.image.delete(slug)
        await context.api.panel.delete('/images/' + image._id)
        handleClose()
    }

    const handleClose = () => {
        if (props?.navigate) navigate(props.navigate)
        if (props?.onChangeShow) props.onChangeShow(false)
        if (props?.onSubmit) props.onSubmit()
    }

    useEffect(async () => {
        if (!props?.id) return
        const image = await context.api.panel.get('/images/' + props.id)
        setImage(image)
        setSlug(image.slug)
    }, [])

    return (
        <Form {...props} data={image} onChange={setImage} 
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Field.Title label="Заголовок зображення" required
                    placeholder="Основна інформація" />
            </Row>
            <Row>
                <Field.Description label="Опис зображення"
                    placeholder="Додаткова інформація" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple />
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.DateTime label="Дата зображення" />
                </Cell>
                <Cell sm="4">
                    <Field.Status label="Видимість зображення" />
                </Cell>
            </Row>
            <Row>
                <Field label="Вибрати зображення">
                    <Image id={image._id} required
                        onChange={setFile} />
                </Field>
            </Row>
            <Row>
                <Field label="Завантажити зображення">
                    <Image id={image._id} slug={slug} required
                        onChange={setFile} />
                </Field>
            </Row>
        </Form>
     )
}