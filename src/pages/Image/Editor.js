import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default function () {

    const [image, setImage] = useState({ tags: [] })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/images/' + params.id, image)
            : await context.api.panel.post('/images', image)
        navigate('/images/list')
    }

    const handleDelete = async () => {
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
    }, [])

    return (
        <Form data={category} onChange={setCategory}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="3">
                    <Field.Title placeholder="Політика" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug source={category.title} placeholder="політика" required />
                </Cell>
                <Cell sm="2">
                    <Field type="number" name="order"
                        min="1" max="30" step="1" placeholder="30" label="Сортування"
                        title="Рівень доступу (число від 1 до 30)" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status label='Видимість категорії' />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Опис категорії" />
            </Row>
            <Row>
                <Field.Image3 placeholder="Зображення категорії" />
            </Row>
        </Form>
     )
}