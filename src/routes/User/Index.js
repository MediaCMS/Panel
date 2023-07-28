import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, generatePath } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function Index() {

    const [users, setUsers] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/користувачі/редактор/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Користувачі / Список',
            submenu: [
                { title: 'Створити', path: '/користувачі/редактор' }
            ]
        })
        const users = await context.api.panel.get('/користувачі')
        setUsers(users)
    }, [])

    return (
        <Table columns={['Назва', 'Пошта', 'Роль']}>
            {users.map(user => (
                <Row status={user.status} key={user._id}
                    onClick={() => handleClick(user._id)}>
                    <Cell className="text-left">{user.title}</Cell>
                    <Cell className="text-left">{user.email}</Cell>
                    <Cell className="text-left">{user.role}</Cell>
                </Row>
            ))}
        </Table>
    )
}