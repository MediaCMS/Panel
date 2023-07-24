import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../../wrappers/Table.js'

export default function () {

    const [comments, setComments] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    useEffect(async () => {
        context.init({
            title: 'Коментарі / Cписок'
        })
        const comments = await context.api.panel.get('/коментарі')
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