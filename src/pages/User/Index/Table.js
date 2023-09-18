import React from 'react'
import Table, { Row, Cell } from '../../../components/Table.js'

export default function (props) {

    return (
        <Table columns={['Назва', 'Пошта', 'Роль']}>
            {props.users.map(user => (
                <Row status={user.status} key={user._id}
                    onClick={() => props.onClick(user._id)}>
                    <Cell className="text-left">{user.title}</Cell>
                    <Cell className="text-left">{user.email}</Cell>
                    <Cell className="text-left">{user.role}</Cell>
                </Row>
            ))}
        </Table>
    )
}