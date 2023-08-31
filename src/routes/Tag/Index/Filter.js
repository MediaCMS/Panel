import React from 'react'
import Form, { Field, Row, Cell } from '../../../wrappers/Form.js'

export default function (props) {

    return (
        <Form {...props}>
            <Row>
                <Cell sm={6}>
                    <Field.Title value={props.data.title}
                        title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field.Status as="select" value={props.data.status} />
                </Cell>
            </Row>
        </Form>
    )
}