import React from 'react'
import Form, { Field, Row, Cell } from '../../../components/Form.js'

export default (props) => {

    return (
        <Form {...props} as="modal">
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
                    <Field.Title title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field.Tag />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Text name="user" label="автором" title="Фільтр за автором"
                        placeholder="вовчок" />
                </Cell>
                <Cell sm={6}>
                    <Field.Status as="select" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Sort>
                        <option value="title">Назва</option>
                        <option value="date">Дата</option>
                        <option value="user">Автор</option>
                    </Field.Sort>
                </Cell>
                <Cell sm={6}><Field.Sort /></Cell>
            </Row>
        </Form>
    )
}