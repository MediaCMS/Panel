import React from 'react'
import Form, { Field, Row, Cell } from '../../../wrappers/Form.js'

export default function (props) {

    return (
        <Form {...props}>
            <Row>
                <Cell sm={6}>
                    <Field.Title title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field.Status as="select" />
                </Cell>
            </Row>
        </Form>
    )
}