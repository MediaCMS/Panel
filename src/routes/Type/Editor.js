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
            ? await context.api.panel.put('/типи/' + params.id, type)
            : await context.api.panel.post('/типи', type)
        navigate('/типи/список')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/типи/' + params.id)
        navigate('/типи/список')
    }

    useEffect(async () => {
        context.init({
            title: 'Типи / Редактор',
            submenu: [
                { title: 'Закрити', path: '/типи/список' }
            ]
        })
        if (!params?.id) return
        setType(
            await context.api.panel.get('/типи/' + params.id)
        )
    }, [])

    return (
        <Form id={params?.id} onChange={setType} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.Title value={type?.title} placeholder="Новина" required />
                </Cell>
                <Cell sm="4">
                    <Field.Slug value={type?.slug} placeholder="новина" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={type?.status} label='Видимість типу' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={type?.description} placeholder="Опис типу" />
            </Row>
        </Form>
    )
}