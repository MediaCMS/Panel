import React from 'react'
import Form, { Field, Row, Cell } from '../../../wrappers/Form.js'

export default function (props) {

    return (
        <Form {...props}>
            <Row>
                <Cell sm={6}>
                    <Field.Title value={props.data.title}
                        title="Фільтр за назвою" placeholder="Леся Українка" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="email" value={props.data.email}
                        label="Пошта" title="Фільтр за поштою" placeholder="user@gmail.com" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Text name="role" value={props.data.role} label="Роль"
                        title="Фільтр за роллю" placeholder="Читач" />
                </Cell>
                <Cell sm={6}>
                    <Field.Status as="select" value={props.data.status} />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Sort value={props.data._sort.field}>
                        <option value="title">Назва</option>
                        <option value="email">Пошта</option>
                        <option value="role">Роль</option>
                    </Field.Sort>
                </Cell>
                <Cell sm={6}>
                    <Field.Sort value={props.data._sort.order} />
                </Cell>
            </Row>
        </Form>
    )
}