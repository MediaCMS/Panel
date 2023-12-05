import React from 'react'
import Form, { Field, Row, Cell } from '../../../components/Form.js'

export default function (props) {

    return (
        <Form {...props}>
            <Row>
                <Cell sm={6}>
                    <Field.Date name="date.start" label="Дата (початкова)"
                        title="Фільтр за періодом (початок)" />
                </Cell>
                <Cell sm={6}>
                    <Field.Date name="date.end" label="Дата (кінцева)"
                        title="Фільтр за періодом (кінець)" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Text name="controller" label="Контролер"
                        title="Фільтр за контролером" placeholder="post" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="action" label="Дія"
                        title="Фільтр за дією" placeholder="update" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Text name="user" label="Користувач"
                        title="Фільтр за користувачем" placeholder="Леся Українка" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="document" label="Документ"
                        title="Фільтр за документом" placeholder="64be976269a893de210bd7d8" />
                </Cell>
            </Row>
        </Form>
    )
}