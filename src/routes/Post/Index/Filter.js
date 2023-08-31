import React from 'react'
import Form, { Field, Row, Cell } from '../../../wrappers/Form.js'

export default function (props) {

    return (
        <Form {...props}>
            <Row>
                <Cell sm={6}>
                    <Field.DateTime name="time.start" value={props.data.time.start}
                        label="Дата (початкова)" title="Фільтр за періодом (початок)" />
                </Cell>
                <Cell sm={6}>
                    <Field.DateTime name="time.end" value={props.data.time.end}
                        label="Дата (кінцева)" title="Фільтр за періодом (кінець)" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Title value={props.data.title}
                        title="Фільтр за назвою" placeholder="Львів" />
                </Cell>
                <Cell sm={6}>
                    <Field.Text name="user" value={props.data.user}
                        label="Пошта" title="Фільтр за поштою"
                        placeholder="Леся Українка" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Status as="select" value={props.data.status} />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Sort value={props.data._sort.field}>
                        <option value="title">Назва</option>
                        <option value="time">Дата</option>
                        <option value="user">Автор</option>
                    </Field.Sort>
                </Cell>
                <Cell sm={6}>
                    <Field.Sort value={props.data._sort.order} />
                </Cell>
            </Row>
        </Form>
    )
}