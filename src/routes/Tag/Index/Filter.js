import React from 'react'
import Filter, { Field, Row, Cell } from '../../../wrappers/Filter.js'

export default function (props) {

    return (
        <Filter setParams={props.setParams} onSubmit={props.onSubmit}
            status={props.status} setStatus={props.setStatus}>
            <Row>
                <Cell sm={4}>
                    <Field type="text" name="title" value={props.params.title} label="Назва"
                        title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field type="select" name="status" value={props.params.status} label="Статус">
                        <option value="">Всі</option>
                        <option value={true}>Видимі</option>
                        <option value={false}>Приховані</option>
                    </Field>
                </Cell>
            </Row>
        </Filter>
    )
}