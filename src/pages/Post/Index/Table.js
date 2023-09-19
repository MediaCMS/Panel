import React from 'react'
import Moment from 'moment'
import Table, { Row, Cell } from '../../../components/Table.js'

export default function (props) {

    return (
        <Table columns={['Дата', 'Назва', 'Автор']}>
            {props.posts.map(post => (
                <Row status={post.status} key={post._id}
                    onClick={() => props.onClick(post._id)}>
                    <Cell className="text-nowrap">{
                        Moment(post.date).format('YYYY-MM-DD HH:mm')
                    }</Cell>
                    <Cell className="text-start overflow-hidden">{post.title}</Cell>
                    <Cell className="text-start text-nowrap">{post.user}</Cell>
                </Row>
            ))}
        </Table>
    )
}