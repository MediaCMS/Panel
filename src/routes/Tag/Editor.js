import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const [tag, setTag] = useState({
        title: '', description: '', slug: '', status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/мітки/' + params.id, tag)
            : await context.api.panel.post('/мітки', tag)
        navigate('/мітки/список')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/мітки/' + params.id)
        navigate('/мітки/список')
    }

    useEffect(async () => {
        context.init({
            title: 'Мітки / Редактор',
            submenu: [
                { title: 'Закрити', path: '/мітки/список' }
            ]
        })
        if (!params?.id) return
        const tags = await context.api.panel.get('/мітки/' + params.id)
        setTag(tags)
    }, [])

    return (
        <Form id={params?.id} onChange={setTag} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.Title value={tag.title} placeholder="Львів" required />
                </Cell>
                <Cell sm="4">
                    <Field.Slug value={tag.slug} placeholder="львів" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={tag.status} label='Видимість мітки' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={tag.description} placeholder="Опис мітки" />
            </Row>
        </Form>
    )
}