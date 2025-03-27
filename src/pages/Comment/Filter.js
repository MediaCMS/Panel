import React from 'react'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Filter = props => {

    return (
        <Form {...props} as="filter">
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
                    <Field.Text name="text" title="Фільтр за текстом"
                        placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="user" label="Автор"
                        title="Фільтр за автором" placeholder="вовчок" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}><Field.Status as="select" /></Cell>
                <Cell sm={6}><Field.Limit /></Cell>
            </Row>
        </Form>
    )
}

export default Filter