import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default props => {

    const [comment, setComment] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/comments/' + props.id, comment)
            : await context.api.panel.post('/comments', comment)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/comments/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setComment(
            await context.api.panel.get('/comments/' + props.id)
        )
    }, [])

    return (
        <Form data={comment} show={props.show} onHide={props.onHide}
            onChange={setComment} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування коментаря">
            <Row>
                <Cell sm="5">
                    <Field.DateTime label="Дата коментаря" required disabled />
                </Cell>
                <Cell sm="4">
                    <Field.Autocomplete name="user" label="Автор коментаря"
                        path="/users" required disabled />
                </Cell>
                <Cell sm="3">
                    <Field.Status label="Видимість"  />
                </Cell>
            </Row>
            <Row>
                <Field.Text rows="3" placeholder="Текст коментаря" required />
            </Row>
        </Form>
    )
}