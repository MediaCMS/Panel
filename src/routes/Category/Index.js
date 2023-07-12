import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [categories, setCategories] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/категорії/редактор/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Категорії (cписок)',
            width: 'small',
            submenu: [
                { title: 'Створити', path: '/категорії/редактор' }
            ]
        })
        const categories = await context.api.panel.get('/категорії')
        setCategories(categories)
    }, [])

    return (
        <Table columns={['Назва', 'Посилання', 'Сортування']}>
            {categories.map(category => (
                <Row status={category.status} key={category._id}
                    onClick={() => handleClick(category._id)}>
                    <Cell align="left">{category.title}</Cell>
                    <Cell align="left">{category.alias}</Cell>
                    <Cell align="center">{category.order}</Cell>
                </Row>
            ))}
        </Table>
    )
}