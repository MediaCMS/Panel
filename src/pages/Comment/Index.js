import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../components/Table.js'

export default function () {

    const [comments, setComments] = useState([])
    const context = useOutletContext()

    useEffect(() => {
        context.init({ title: 'Коментарі / Список' })
    }, [])

    useEffect(async () => {
        const comments = await context.api.panel.get('/comments')
        setComments(comments)
    }, [])

    return (
        <Table columns={['Дата', 'Повідомлення', 'Користувач']}>
            {comments.map(comment => (
                <Row status={comment.status} key={comment._id}
                    onClick={() => handleClick(comment._id)}>
                    <Cell className="text-left">{comment.time}</Cell>
                    <Cell className="text-left">{comment.text}</Cell>
                    <Cell className="text-left">{comment.user}</Cell>
                </Row>
            ))}
        </Table>
    )
}