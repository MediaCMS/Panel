import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default (props) => {

    const [category, setCategory] = useState({ order: 30 })
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/categories/' + props.id, category)
            : await context.api.panel.post('/categories', category)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/categories/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setCategory(
            await context.api.panel.get('/categories/' + props.id)
        )
    }, [])

    return (
        <Form {...props} data={category} onChange={setCategory}
            onSubmit={handleSubmit} onDelete={handleDelete}>
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