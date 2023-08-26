import React, { useState, useEffect } from 'react'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const [role, setRole] = useState({
        title: '', description: '', level: 5, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id
            ? await context.api.panel.put('/roles/' + params.id, role)
            : await context.api.panel.post('/roles', role)
        navigate('/roles/list')
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/roles/' + params.id)
        navigate('/roles/list')
    }

    useEffect(async () => {
        context.init({
            title: 'Ролі / Редактор',
            submenu: [
                { title: 'Закрити', path: '/roles/list' }
            ]
        })
        if (!params?.id) return
        const role = await context.api.panel.get('/roles/' + params.id)
        if (!role) {
            context.setAlert('Роль не знайдена')
            navigate('/roles/list')
            return
        }
        setRole(role)
    }, [])

    return (
        <Form id={params?.id} onChange={setRole} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="6">
                    <Field.Title value={role?.title} placeholder="Читач" required />
                </Cell>
                <Cell sm="2">
                    <Field type="number" name="level" value={role?.level}
                        min="1" max="5" step="1" placeholder="5" label="Рівень"
                        title="Рівень доступу (від 1 до 5)" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status value={role?.status} label='Видимість ролі' />
                </Cell>
            </Row>
            <Row>
                <Field.Description value={role?.description} placeholder="Опис ролі" />
            </Row>
        </Form>
    )
}