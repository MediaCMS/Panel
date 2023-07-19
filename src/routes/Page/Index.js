import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [pages, setPages] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/сторінки/редактор/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Сторінки / Список',
            submenu: [
                { title: 'Створити', path: '/сторінки/редактор' }
            ]
        })
        const pages = await context.api.panel.get('/сторінки')
        setPages(pages)
    }, [])

    return (
        <Table columns={['Назва', 'Посилання', 'Опис']}>
            {pages.map(page => (
                <Row status={page.status} key={page._id}
                    onClick={() => handleClick(page._id)}>
                    <Cell className="text-left text-nowrap">{page.title}</Cell>
                    <Cell className="text-left text-nowrap">{page.slug}</Cell>
                    <Cell className="text-left overflow-hidden">{page.description}</Cell>
                </Row>
            ))}
        </Table>
    )
}