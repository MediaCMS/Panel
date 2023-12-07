import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default props => {

    const [tag, setTag] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/tags/' + props.id, tag)
            : await context.api.panel.post('/tags', tag)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/tags/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setTag(
            await context.api.panel.get('/tags/' + props.id)
        )
    }, [])

    return (
        <Form data={tag} show={props.show} onHide={props.onHide}
            onChange={setTag} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування мітки">
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