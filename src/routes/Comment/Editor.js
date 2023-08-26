import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const [comment, setComment] = useState({
        time: '', body: '', user: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/comments/' + params.id, comment)
            : await context.api.panel.post('/comments', comment)
        navigate('/comments/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/comments/' + params.id)
        navigate('/comments/list')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Коментарі / Редактор',
            submenu: [
                { title: 'Закрити', url: '/comments/list' }
            ]
        })
        if (!params?.id) return
        setType(
            await context.api.panel.get('/comments/' + params.id)
        )
    }, [])

    return (
        <Form id={params.id} onChange={setComment} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.DateTime value={comment.time} required disabled />
                </Cell>
                <Cell sm="4">
                    <Field.Text value={comment.user} required disabled />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={comment.status} label='Видимість коментаря' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={comment.body} placeholder="Текст коментаря" />
            </Row>
        </Form>
    )
}