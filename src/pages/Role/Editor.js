import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default (props) => {

    const [role, setRole] = useState({ level: 5 })
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/roles/' + props.id, role)
            : await context.api.panel.post('/roles', role)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/roles/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setRole(
            await context.api.panel.get('/roles/' + props.id)
        )
    }, [])

    return (
        <Form {...props} data={role} onChange={setRole}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="6">
                    <Field.Title placeholder="Читач" required />
                </Cell>
                <Cell sm="2">
                    <Field type="number" name="level"
                        min="1" max="5" step="1" placeholder="5" label="Рівень"
                        title="Рівень доступу (від 1 до 5)" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status label="Видимість ролі" />
                </Cell>
            </Row>
            <Row><Field.Description placeholder="Опис ролі" /></Row>
        </Form>
    )
}