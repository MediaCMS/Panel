import React from 'react'
import Form, { Field, Row, Cell } from '../../components/Form.js'

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
                <Cell sm={4}>
                    <Field.Title title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={4}>
                    <Field.Tag />
                </Cell>
                <Cell sm={4}>
                    <Field.Status as="select" />
                </Cell>
            </Row>
        </Form>
    )
}