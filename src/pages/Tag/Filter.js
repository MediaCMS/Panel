import React from 'react'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Tag = props => {

    return (
        <Form {...props} as="filter">
            <Row>
                <Cell sm={4}>
                    <Field.Title title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={4}>
                    <Field.Status as="select" />
                </Cell>
                <Cell sm={4}><Field.Limit /></Cell>
            </Row>
        </Form>
    )
}

export default Tag