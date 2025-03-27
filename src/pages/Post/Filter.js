import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

const Filter = props => {

    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const context = useOutletContext()

    useEffect(() => {
        (async () => {
            setCategories(
                await context.api.panel.get('/categories')
            )
        })()
    }, [])

    useEffect(() => {
        (async () => {
            setTypes(
                await context.api.panel.get('/types')
            )
        })()
    }, [])


    return (
        <Form {...props} as="filter" size="lg">
            <Row>
                <Cell sm="3">
                    <Field.Date name="date.start" label="Дата (початкова)"
                        title="Фільтр за періодом (початок)" />
                </Cell>
                <Cell sm="3">
                    <Field.Date name="date.end" label="Дата (кінцева)"
                        title="Фільтр за періодом (кінець)" />
                </Cell>
                <Cell sm="3">
                    <Field type="select" name="category" label="Категорія">
                        <option value="">Всі</option>
                        {categories.map(category => (
                            <option value={category._id} key={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </Field>
                </Cell>
                <Cell sm="3">
                    <Field type="select" name="type" label="Тип">
                        <option value="">Всі</option>
                        {types.map(type => (
                            <option value={type._id} key={type._id}>
                                {type.title}
                            </option>
                        ))}
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Cell sm="4">
                    <Field.Title title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm="4">
                    <Field.Tag />
                </Cell>
                <Cell sm="4">
                    <Field.Text name="user" label="Автор" title="Фільтр за автором"
                        placeholder="вовчок" disabled={props.user.role.level === 4} />
                </Cell>
            </Row>
            
            <Row>
                <Cell sm="3">
                    <Field.Sort>
                        <option value="title">Назва</option>
                        <option value="date">Дата</option>
                        <option value="user">Автор</option>
                    </Field.Sort>
                </Cell>
                <Cell sm="3"><Field.Sort /></Cell>
                <Cell sm="3"><Field.Status as="select" /></Cell>
                <Cell sm="3"><Field.Limit /></Cell>
            </Row>
        </Form>
    )
}

Filter.propTypes = {
    user: PropTypes.shape({
        role: PropTypes.shape({
            level: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
}

export default Filter