import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'
import config from '../../config.js'

export default function () {

    const [image, setImage] = useState({})
    const [file, setFile] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        if (params?.id) {
            await context.api.panel.put('/images/' + params.id, image)
        } else {
            const imageExport = { ...image }
            const formData = new FormData()
            formData.append('image', file)
            const response = await context.api.image.post('', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }}
            )
            imageExport.path = response.path
            await context.api.panel.post('/images', imageExport)
        }
        navigate('/images/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/images/' + params.id)
        await context.api.image.delete('/' + image.path.substr(7, 32))
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
    }, [])

    return (
        <Form data={image} onChange={setImage}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Field.Image as="upload" name="path" onChange={setFile}
                    label="Файл зображення" required />
            </Row>
            <Row>
                <Cell sm="4">
                    <Field.Title label="Заголовок зображення"
                        placeholder="Основна інформація" required />
                </Cell>
                <Cell sm="4">
                    <Field.DateTime label="Дата зображення" />
                </Cell>
                <Cell sm="4">
                    <Field.Status label="Видимість зображення" />
                </Cell>
            </Row>
            <Row>
                <Field.Description label="Опис зображення"
                    placeholder="Додаткова нформація" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple />
            </Row>
        </Form>
     )
}