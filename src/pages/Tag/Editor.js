import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Editor = ({ id, show, onChange, onHide }) => {

    const [tag, setTag] = useState({})
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (id) {
            await context.api.panel.put('/tags/' + id, tag)
        } else {
            await context.api.panel.post('/tags', tag)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/tags/' + id)
        onChange()
    }

    useEffect(() => {
        id && (async () => 
            setTag(
                await context.api.panel.get('/tags/' + id)
            )
        )()
}, [])

    return (
        <Form data={tag} show={show} onHide={onHide}
            onChange={setTag} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування мітки">
            <Row>
                <Cell sm="4">
                    <Field.Title placeholder="Львів" maxLength="64" required />
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

Editor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default Editor