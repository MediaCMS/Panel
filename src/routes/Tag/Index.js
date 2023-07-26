import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [tags, setTags] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/мітки/редактор/' + id)
    }

    useEffect(async () => {
        context.init({
            title: 'Мітки / Cписок',
            submenu: [
                { title: 'Створити', path: '/мітки/редактор' }
            ]
        })
        const tags = await context.api.panel.get('/мітки')
        setTags(tags)
    }, [])

    return (
        <Table columns={['Заголовок', 'Опис']}>
            {tags.map(tag => (
                <Row status={tag.status} key={tag._id}
                    onClick={() => handleClick(tag._id)}>
                    <Cell className="text-left col-2">{tag.title}</Cell>
                    <Cell className="text-left">{tag.description}</Cell>
                </Row>
            ))}
        </Table>
    )
}