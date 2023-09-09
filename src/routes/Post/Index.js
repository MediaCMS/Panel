import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Moment from 'moment'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-5, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        status: true,
        _sort: { field: 'time', order: 1 }
    })
    const context = useOutletContext()
    const navigate = useNavigate()
console.log(params)
    const handleClick = id => {
        navigate('/posts/editor/' + id)
    }

    const handleLoad = async () => {
        const posts = await context.api.panel.get('/posts', { params })
        setPosts(posts)
    }

    useEffect(() => {
        context.init({
            title: 'Публікації / Список',
            submenu: [
                { title: 'Створити', path: '/posts/editor' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Table posts={posts} onClick={handleClick} />
        {filter &&
            <Filter data={params} onChange={setParams}
                show={filter} onChangeShow={setFilter}
                onSubmit={handleLoad} />
        }
    </>
}