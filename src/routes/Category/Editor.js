import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const [category, setCategory] = useState({
        title: '', description: '', order: 30, slug: '', status: false
    })
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

    useEffect(async () => {
        context.init({
            title: 'Категорії / Редактор',
            submenu: [
                { title: 'Закрити', path: '/categories/list' }
            ]
        })
        if (!params?.id) return
        const category = await context.api.panel.get('/categories/' + params.id)
        if (!category) {
            context.setMessage('Категорія не знайдена')
            navigate('/categories/list')
            return
        }
        setCategory(category)
    }, [])

    return (
        <Form id={params.id} onChange={setCategory} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="3">
                    <Field.Title value={category.title} placeholder="Політика" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug value={category.slug} source={category.title} placeholder="політика" required />
                </Cell>
                <Cell sm="2">
                    <Field type="number" name="order" value={category.order}
                        min="1" max="30" step="1" placeholder="30" label="Сортування"
                        title="Рівень доступу (число від 1 до 30)" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={category.status} label='Видимість категорії' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={category.description} placeholder="Опис категорії" />
            </Row>
        </Form>
     )
}