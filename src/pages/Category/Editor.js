import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Editor = ({ id, show, onChange, onHide }) => {

    const [category, setCategory] = useState({ order: 30 })
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (id) {
            await context.api.panel.put('/categories/' + id, category)
        } else {
            await context.api.panel.post('/categories', category)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/categories/' + id)
        onChange()
    }

    useEffect(async () => {
        id && setCategory(
            await context.api.panel.get('/categories/' + id)
        )
    }, [])

    return (
        <Form data={category} show={show} onHide={onHide}
            onChange={setCategory} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування категорії">
            <Row>
                <Cell sm="3">
                    <Field.Title placeholder="Політика" maxLength="16" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug source={category.title} placeholder="політика" required />
                </Cell>
                <Cell sm="2">
                    <Field type="number" name="order"
                        min="1" max="30" step="1" placeholder="30" label="Сортування"
                        title="Рівень доступу (число від 1 до 30)" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status label='Видимість категорії' />
                </Cell>
            </Row>
            <Row><Field.Description placeholder="Опис категорії" /></Row>
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