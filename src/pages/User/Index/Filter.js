import React from 'react'
import Form, { Field, Row, Cell } from '../../../components/Form.js'

export default function (props) {

    return (
        <Form {...props} as="modal">
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
                <Cell sm={6}>
                    <Field.Text name="role" label="Роль"
                        title="Фільтр за роллю" placeholder="Читач" />
                </Cell>
                <Cell sm={6}>
                    <Field.Status as="select" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Sort>
                        <option value="title">Назва</option>
                        <option value="email">Пошта</option>
                        <option value="role">Роль</option>
                    </Field.Sort>
                </Cell>
                <Cell sm={6}><Field.Sort /></Cell>
            </Row>
        </Form>
    )
}