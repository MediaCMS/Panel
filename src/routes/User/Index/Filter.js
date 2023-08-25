import React from 'react'
import Filter, { Field, Row, Cell } from '../../../wrappers/Filter.js'

export default function (props) {

    return (
        <Filter setParams={props.setParams} onSubmit={props.onSubmit}
            status={props.status} setStatus={props.setStatus}>
            <Row>
                <Cell sm={6}>
                    <Field type="text" name="title" value={props.params.title}
                        label="Назва" title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field type="text" name="email" value={props.params.email}
                        label="Пошта" title="Фільтр за поштою" placeholder="user@gmail.com" />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field type="select" name="_sortField"/* value={props.params._sortField}*/
                        label="Поле сортування">
                        <option value="title">Назва</option>
                        <option value="email">Пошта</option>
                        <option value="role">Роль</option>
                    </Field>
                </Cell>
                <Cell sm={6}>
                    <Field type="select" name="_sortOrder" value={props.params._sortOrder}
                        label="Напрям сортування">
                        <option value={1}>Низхідний</option>
                        <option value={-1}>Виcхідний</option>
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field type="select" name="_status" value={props.params.status} label="Статус">
                        <option value="">Всі</option>
                        <option value={true}>Видимі</option>
                        <option value={false}>Приховані</option>
                    </Field>
                </Cell>
            </Row>

        </Filter>
    )
}