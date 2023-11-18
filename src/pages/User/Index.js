import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        status: true, _sort: { field: 'title', order: 1 }
    })
    const [users, setUsers] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/users/editor/' + id)
    }

    const handleLoad = async () => {
        setUsers(
            await context.api.panel.get('/users', { params })
        )
    }

    useEffect(() => {
        context.init({
            title: 'Користувачі / Список',
            submenu: [
                { title: 'Створити', path: '/users/editor' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Table users={users} onClick={handleClick} />
        <Filter data={params} onChange={setParams}
            show={filter} onChangeShow={setFilter}
            onSubmit={handleLoad} />
    </>
}