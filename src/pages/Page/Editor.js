import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default function () {

    const [page, setPage] = useState({})
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/pages/' + params.id, page)
            : await context.api.panel.post('/pages', page)
        navigate('/pages/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/pages/' + params.id)
        navigate('/pages/list')
    }

    useEffect(() => {
        context.init({
            title: 'Сторінки / Редактор',
            submenu: [
                { title: 'Закрити', path: '/pages/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        params?.id && setPage(
            await context.api.panel.get('/pages/' + params.id)
        )
    }, [])

    return (
        <Form data={page} onChange={setPage}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="3">
                    <Field.Title placeholder="Про проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug source={page.title} placeholder="про-проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status label="Видимість сторінки" />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Опис сторінки" />
            </Row>
            <Row><Field.Body placeholder="Текст сторінки" /></Row>
            <Row><Field.Image /></Row>
        </Form>
     )
}