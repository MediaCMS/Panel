import PropTypes from 'prop-types'
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
                    <Field.Title title="Фільтр за назвою" placeholder="львів" />
                </Cell>
                <Cell sm={6}>
                    <Field.Tag />
                </Cell>
            </Row>
            <Row>
                <Cell sm={6}>
                    <Field.Text name="user" label="Автор" title="Фільтр за автором"
                        placeholder="вовчок" disabled={props.user.role.level === 4} />
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

Filter.propTypes = {
    user: PropTypes.shape({
        role: PropTypes.shape({
            level: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
}

export default Filter