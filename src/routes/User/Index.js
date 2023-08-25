import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        title: null, status: true
    })
    const [users, setUsers] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/користувачі/редактор/' + id)
    }

    const handleLoad = async () => {
        const users = await context.api.panel.get('/користувачі', { params })
        setUsers(users)
    }

    useEffect(async () => {
        context.init({
            title: 'Користувачі / Список',
            submenu: [
                { title: 'Створити', path: '/користувачі/редактор' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
        handleLoad()
    }, [])

    return <>
        <Table users={users} onClick={handleClick} />
        {filter && 
            <Filter params={params} setParams={setParams}
                status={filter} setStatus={setFilter}
                onSubmit={handleLoad} />}
    </>
}