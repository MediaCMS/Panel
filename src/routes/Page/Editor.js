import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const [page, setPage] = useState({
        title: '', description: '', alias: '', status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        page?._id
            ? await context.api.panel.put('/сторінки/' + params.id, page)
            : await context.api.panel.post('/сторінки', page)
        navigate('/сторінки/список')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/сторінки/' + params.id)
        navigate('/сторінки/список')
    }

    useEffect(async () => {
        context.init({
            title: 'Сторінки (редактор)',
            submenu: [
                { title: 'Закрити', path: '/сторінки/список' }
            ]
        })
        if (!params?.id) return
        const page = await context.api.panel.get('/сторінки/' + params.id)
        if (!page) {
            context.setMessage('Сторінка не знайдена')
            navigate('/сторінки/список')
            return
        }
        setPage(page)
    }, [])

    return (
        <Form id={params.id} onChange={setPage} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="3">
                    <Field.Title value={page.title} placeholder="Про проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug name="alias" value={page.alias} placeholder="про-проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={page.status} label='Видимість сторінки' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={page.description} placeholder="Опис сторінки" />
            </Row>
        </Form>
     )
}