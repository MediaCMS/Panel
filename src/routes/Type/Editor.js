import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const [type, setType] = useState({
        title: '', description: '', slug: '', status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/types/' + params.id, type)
            : await context.api.panel.post('/types', type)
        navigate('/types/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/types/' + params.id)
        navigate('/types/list')
    }

    useEffect(() => {
        context.init({
            title: 'Типи / Редактор',
            submenu: [
                { title: 'Закрити', path: '/types/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        if (!params?.id) return
        const types = await context.api.panel.get('/types/' + params.id)
        setType(types)
    }, [])

    return (
        <Form id={params.id} onChange={setType} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.Title value={type.title} placeholder="Новина" maxLength="16" required />
                </Cell>
                <Cell sm="4">
                    <Field.Slug value={type.slug} source={type.title} placeholder="новина" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={type.status} label='Видимість типу' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={type.description} placeholder="Опис типу" />
            </Row>
        </Form>
    )
}