import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'
import Image from './Editor/Image.js'
import Slug from './Editor/Slug.js'

export default function (props) {

    const [image, setImage] = useState({})
    const [slug, setSlug] = useState()
    const [file, setFile] = useState({})
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        console.log('handleSubmit', params)
        if (params?.id) {
            if (image.slug !== slug) {
                await context.api.image.patch(slug, { slug: image.slug })
            }
            await context.api.panel.put('/images/' + params.id, image)
        } else {
            const formData = new FormData()
            formData.append('image', file)
            await context.api.image.post(image.slug, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }}
            )
            await context.api.panel.post('/images', image)
        }
        navigate('/images/list')
    }

    const handleDelete = async () => {
        await context.api.image.delete(slug)
        await context.api.panel.delete('/images/' + params.id)
        navigate('/images/list')
    }

    useEffect(() => {
        context.init({
            title: 'Зображення / Редактор',
            submenu: [
                { title: 'Закрити', path: '/images/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        if (!params?.id) return
        const image = await context.api.panel.get('/images/' + params.id)
        setImage(image)
        setSlug(image.slug)
    }, [])

    return (
        <Form data={image} onChange={setImage} title={props.title}
            show={props.show} onChangeShow={props.onChangeShow} as={props.as}
            onSubmit={handleSubmit} onDelete={handleDelete} size={props.size}>
            <Row>
                <Field label="Файл зображення">
                    <Image id={params.id} slug={slug} required
                        onChange={setFile} />
                </Field>
            </Row>
            <Row>
                <Field.Title label="Заголовок зображення" required
                    placeholder="Основна інформація" />
            </Row>
            <Row>
                <Field label="Назва файла зображення">
                    <Slug value={image.slug} title={image.title}
                        file={file.name} required />
                </Field>
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
        </Form>
     )
}