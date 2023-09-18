import React from 'react'
import Table, { Row, Cell } from '../../../components/Table.js'

export default function (props) {

    return (
        <Table columns={['Заголовок', 'Опис']}>
            {props.tags.map(tag => (
                <Row status={tag.status} key={tag._id}
                    onClick={() => props.onClick(tag._id)}>
                    <Cell className="text-left col-2">{tag.title}</Cell>
                    <Cell className="text-left">{tag.description}</Cell>
                </Row>
            ))}
        </Table>
    )
}