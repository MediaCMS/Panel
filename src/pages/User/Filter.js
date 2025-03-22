import React from 'react'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Filter = props => {

    return (
        <Form {...props} as="filter" size="lg">
            <Row>
                <Cell sm={6}>
                    <Field.Title title="Фільтр за назвою"
                        placeholder="Леся Українка" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="email" label="Пошта"
                        title="Фільтр за поштою" placeholder="user@gmail.com" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={4}>
                    <Field.Text name="role" label="Роль"
                        title="Фільтр за роллю" placeholder="Читач" />
                </Cell>
                <Cell sm={4}>
                    <Field.Status as="select" />
                </Cell>
                <Cell sm={4}><Field.Limit /></Cell>
            </Row>
            <Row>
                <Cell sm={4}>
                    <Field.Sort>
                        <option value="title">Назва</option>
                        <option value="email">Пошта</option>
                        <option value="role">Роль</option>
                    </Field.Sort>
                </Cell>
                <Cell sm={4}><Field.Sort /></Cell>
            </Row>
        </Form>
    )
}

export default Filter