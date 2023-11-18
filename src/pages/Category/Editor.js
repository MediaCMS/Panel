import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default () => {

    const [category, setCategory] = useState({ order: 30 })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/categories/' + params.id, category)
            : await context.api.panel.post('/categories', category)
        navigate('/categories/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/categories/' + params.id)
        navigate('/categories/list')
    }

    useEffect(() => {
        context.init({
            title: 'Категорії / Редактор',
            submenu: [
                { title: 'Закрити', path: '/categories/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        params?.id && setCategory(
            await context.api.panel.get('/categories/' + params.id)
        )
    }, [])

    return (
        <Form data={category} onChange={setCategory}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="3">
                    <Field.Title placeholder="Політика" maxLength="16" required />
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
            <Row><Field.Description placeholder="Опис категорії" /></Row>
            <Row><Field.Image /></Row>
        </Form>
     )
}