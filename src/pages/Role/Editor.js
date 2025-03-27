import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Editor = ({ id, show, onChange, onHide }) => {

    const [role, setRole] = useState({ level: 5 })
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (id) {
            await context.api.panel.put('/roles/' + id, role)
        } else {
            await context.api.panel.post('/roles', role)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/roles/' + id)
        onChange()
    }

    useEffect(() => {
        id && (async () =>
            setRole(
                await context.api.panel.get('/roles/' + id)
            )
        )()
    }, [])

    return (
        <Form data={role} show={show} onHide={onHide}
            onChange={setRole} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування ролі">
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

Editor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default Editor