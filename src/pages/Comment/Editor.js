import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default function () {

    const [comment, setComment] = useState({})
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

    useEffect(() => {
        context.init({
            title: 'Коментарі / Редактор',
            submenu: [
                { title: 'Закрити', url: '/comments/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        params?.id && setComment(
            await context.api.panel.get('/comments/' + params.id)
        )
    }, [])

    return (
        <Form data={comment} onChange={setComment}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.DateTime required disabled />
                </Cell>
                <Cell sm="4">
                    <Field.Text required disabled />
                </Cell>
                <Cell sm="3">
                    <Field.Status label="Видимість коментаря" />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Текст коментаря" />
            </Row>
        </Form>
    )
}