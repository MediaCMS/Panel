import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [tags, setTags] = useState([])
    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({ status: true })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/tags/editor/' + id)
    }

    const handleLoad = async () => {
        setTags(
            await context.api.panel.get('/tags', { params })
        )
    }

    useEffect(() => {
        context.init({
            title: 'Мітки / Список',
            submenu: [
                { title: 'Створити', path: '/tags/editor' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Table tags={tags} onClick={handleClick} />
        <Filter data={params} onChange={setParams}
            show={filter} onChangeShow={setFilter}
            onSubmit={handleLoad} />
    </>
}