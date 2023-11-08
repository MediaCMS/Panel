import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default () => {

    const [type, setType] = useState({})
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
        params?.id && setType(
            await context.api.panel.get('/types/' + params.id)
        )
    }, [])

    return (
        <Form data={type} onChange={setType}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.Title placeholder="Новина" maxLength="16" required />
                </Cell>
                <Cell sm="4">
                    <Field.Slug source={type.title} placeholder="новина" required />
                </Cell>
                <Cell sm="4">
                    <Field.Status label='Видимість типу' />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Опис типу" />
            </Row>
            <Row>
                <Field.Image />
            </Row>
        </Form>
    )
}