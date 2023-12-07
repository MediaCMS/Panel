import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default props => {

    const [page, setPage] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/pages/' + props.id, page)
            : await context.api.panel.post('/pages', page)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/pages/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setPage(
            await context.api.panel.get('/pages/' + props.id)
        )
    }, [])

    return (
        <Form data={page} show={props.show} onHide={props.onHide}
            onChange={setPage} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування сторінки">
            <Row>
                <Cell sm="3">
                    <Field.Title placeholder="Про проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug source={page.title} placeholder="про-проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status label="Видимість сторінки" />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Опис сторінки" />
            </Row>
            <Row><Field.Body placeholder="Текст сторінки" /></Row>
            <Row><Field.Image /></Row>
        </Form>
     )
}