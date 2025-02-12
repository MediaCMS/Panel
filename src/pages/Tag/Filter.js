import React from 'react'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Tag = props => {

    return (
        <Form {...props} as="filter">
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

export default Tag