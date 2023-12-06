import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default props => {

    const [type, setType] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/types/' + props.id, type)
            : await context.api.panel.post('/types', type)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/types/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setType(
            await context.api.panel.get('/types/' + props.id)
        )
    }, [])

    return (
        <Form {...props} data={type} onChange={setType}
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
            <Row><Field.Description placeholder="Опис типу" /></Row>
            <Row><Field.Image /></Row>
        </Form>
    )
}