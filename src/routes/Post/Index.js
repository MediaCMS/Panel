import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [posts, setPosts] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/публікації/редактор/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Публікації / Cписок',
            submenu: [
                { title: 'Створити', path: '/публікації/редактор' }
            ]
        })
        const posts = await context.api.panel.get('/публікації')
        setPosts(posts)
    }, [])

    return (
        <Table columns={['Дата', 'Назва', 'Автор']}>
            {posts.map(post => (
                <Row status={post.status} key={post._id}
                    onClick={() => handleClick(post._id)}>
                    <Cell className="text-nowrap">{post.time.split('T')[0]}</Cell>
                    <Cell className="text-start overflow-hidden">{post.title}</Cell>
                    <Cell className="text-start text-nowrap">{post.user}</Cell>
                </Row>
            ))}
        </Table>
    )
}