import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [roles, setRoles] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/ролі/редактор/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Ролі / Список',
            submenu: [
                { title: 'Створити', path: '/ролі/редактор' }
            ]
        })
        const roles = await context.api.panel.get('/ролі')
        setRoles(roles)
    }, [])

    return (
        <Table columns={['Назва', 'Опис', 'Рівень']}>
            {roles.map(role => (
                <Row status={role.status} key={role._id}
                    onClick={() => handleClick(role._id)}>
                    <Cell className="text-left">{role.title}</Cell>
                    <Cell className="text-left">{role.description}</Cell>
                    <Cell className="text-center">{role.level}</Cell>
                </Row>
            ))}
        </Table>
    )
}