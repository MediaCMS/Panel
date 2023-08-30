import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        title: null, status: true,
        _sort: { field: 'title', order: 1 }
    })
    const [tags, setTags] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/tags/editor/' + id)
    }

    const handleLoad = async () => {
        const tags = await context.api.panel.get('/tags', { params })
        setTags(tags)
    }

    useEffect(async () => {
        context.init({
            title: 'Мітки / Cписок',
            submenu: [
                { title: 'Створити', path: '/tags/editor' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
        handleLoad()
    }, [])

    return <>
        <Table tags={tags} onClick={handleClick} />
        {filter && 
            <Filter params={params} setParams={setParams}
                status={filter} setStatus={setFilter}
                onSubmit={handleLoad} />}
    </>
}