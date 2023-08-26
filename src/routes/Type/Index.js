import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [types, setTypes] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/types/editor/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Типи / Список',
            submenu: [
                { title: 'Створити', path: '/types/editor' }
            ],
            width: 'small'
        })
        const types = await context.api.panel.get('/types')
        setTypes(types)
    }, [])

    return (
        <Table columns={['Назва', 'Опис']}>
            {types.map(type => (
                <Row status={type.status} key={type._id}
                    onClick={() => handleClick(type._id)}>
                    <Cell className="text-left">{type.title}</Cell>
                    <Cell className="text-left">{type.description}</Cell>
                </Row>
            ))}
        </Table>
    )
}