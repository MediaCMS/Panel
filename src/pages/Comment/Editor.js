import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Editor = ({ id, show, onChange, onHide }) => {

    const [comment, setComment] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (id) {
            await context.api.panel.put('/comments/' + id, comment)
        } else {
            await context.api.panel.post('/comments', comment)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/comments/' + id)
        onChange()
    }

    useEffect(async () => {
        id && setComment(
            await context.api.panel.get('/comments/' + id)
        )
    }, [])

    return (
        <Form data={comment} show={show} onHide={onHide}
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

Editor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default Editor