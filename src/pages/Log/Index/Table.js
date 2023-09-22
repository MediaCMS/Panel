import React from 'react'
import Moment from 'moment'
import Table, { Row, Cell } from '../../../components/Table.js'

export default function (props) {

    return (
        <Table columns={['Дата', 'Контроллер', 'Дія', 'Користувач', 'Документ']}>
            {props.logs.map(log => (
                <Row key={log._id}>
                    <Cell className="text-center">{
                        Moment(log.date).format('YYYY-MM-DD HH:mm:ss')
                    }</Cell>
                    <Cell className="text-center">{log.controller}</Cell>
                    <Cell className="text-center">{log.action}</Cell>
                    <Cell className="text-center">{log.user}</Cell>
                    <Cell className="text-center">{log.document}</Cell>
                </Row>
            ))}
        </Table>
    )
}