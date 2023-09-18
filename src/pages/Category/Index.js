import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../components/Table.js'

export default function () {

    const [categories, setCategories] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/categories/editor/' + id)
    }

    useEffect(() => {
        context.init({
            title: 'Категорії / Список',
            width: 'small',
            submenu: [
                { title: 'Створити', path: '/categories/editor' }
            ]
        })
    }, [])

    useEffect(async () => {
        const categories = await context.api.panel.get('/categories')
        setCategories(categories)
    }, [])

    return (
        <Table columns={['Назва', 'Посилання', 'Сортування']}>
            {categories.map(category => (
                <Row status={category.status} key={category._id}
                    onClick={() => handleClick(category._id)}>
                    <Cell className="text-left">{category.title}</Cell>
                    <Cell className="text-left">{category.slug}</Cell>
                    <Cell className="text-center">{category.order}</Cell>
                </Row>
            ))}
        </Table>
    )
}