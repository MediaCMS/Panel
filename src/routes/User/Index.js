import React, { useState, useEffect } from 'react'
import {
    useSearchParams, useNavigate, useOutletContext, generatePath
} from 'react-router-dom'
import Table from '../../Table.js'

export default function Index() {

    const [users, setUsers] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/користувачі/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Користувачі (cписок)',
            router: ['user', 'index'],
            submenu: [
                { title: 'Створити', url: '/користувачі/редактор' }
            ]
        })
        setUsers({ items:
            await context.api.get('/користувачі', {
                params: { 'сортування': 'role.level:1,title:1' }
            })
        })
    }, [searchParams])

    return (
        <Table className='mw-lg' onClick={handleClick}
            columns={[
                { title: 'Дата', class: 'text-center text-nowrap'},
                { title: 'Заголовок', class: 'text-start' },
                { title: 'Роль', class: 'text-center' }
            ]} rows={users.items.length ? users.items.map(user => ({
                id: user._id, status: user.status,
                values: [user.time.split('T')[0], user.title, user.role.title]
            })) : []}
        />
    )
}