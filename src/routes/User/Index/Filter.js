import React from 'react'
import Filter, { Field, Row, Cell } from '../../../wrappers/Filter.js'

export default function (props) {

    return (
        <Filter {...props}>
            <Row>
                <Cell sm={6}>
                    <Field.Title value={props.params.title}
                        title="Фільтр за назвою" placeholder="Леся Українка" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="email" value={props.params.email}
                        label="Пошта" title="Фільтр за поштою" placeholder="user@gmail.com" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Text name="role" value={props.params.role} label="Роль"
                        title="Фільтр за роллю" placeholder="Читач" />
                </Cell>
                <Cell sm={6}>
                    <Field.Status as="select" value={props.params.status} />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Sort value={props.params._sort.field}>
                        <option value="title">Назва</option>
                        <option value="email">Пошта</option>
                        <option value="role">Роль</option>
                    </Field.Sort>
                </Cell>
                <Cell sm={6}>
                    <Field.Sort value={props.params._sort.order} />
                </Cell>
            </Row>
        </Filter>
    )
}