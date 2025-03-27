import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Editor = ({ id, show, onChange, onHide }) => {

    const [type, setType] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (id) {
            await context.api.panel.put('/types/' + id, type)
        } else {
            await context.api.panel.post('/types', type)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/types/' + id)
        onChange()
    }

    useEffect(() => {
        id && (async () =>
            setType(
                await context.api.panel.get('/types/' + id)
            )
        )()
    }, [])

    return (
        <Form data={type} show={show} onHide={onHide}
            onChange={setType} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування типу">
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

Editor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default Editor