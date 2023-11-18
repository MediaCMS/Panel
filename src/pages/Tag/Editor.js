import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default () => {

    const [tag, setTag] = useState({})
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/tags/' + params.id, tag)
            : await context.api.panel.post('/tags', tag)
        navigate('/tags/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/tags/' + params.id)
        navigate('/tags/list')
    }

    useEffect(() => {
        context.init({
            title: 'Мітки / Редактор',
            submenu: [
                { title: 'Закрити', path: '/tags/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        params?.id && setTag(
            await context.api.panel.get('/tags/' + params.id)
        )
    }, [])

    return (
        <Form data={tag} onChange={setTag}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.Title placeholder="Львів" maxLength="32" required />
                </Cell>
                <Cell sm="4">
                    <Field.Slug source={tag.title} placeholder="львів" required />
                </Cell>
                <Cell sm="4">
                    <Field.Status label='Видимість мітки' />
                </Cell>
            </Row>
            <Row><Field.Description placeholder="Опис мітки" /></Row>
            <Row><Field.Image /></Row>
        </Form>
    )
}