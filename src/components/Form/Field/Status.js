import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

const Status = props => {

    // eslint-disable-next-line no-unused-vars
    const { className, label, ...propsNew } = {
        name: 'status', ...props
    }

    return (
        <Form.Group className={props.className}>
            <Form.Label>{props.label ?? 'Статус'}</Form.Label>
            {(props?.as && props.as === 'select')
                 ? (<Control type="select" {...propsNew} title="Фільтр за статусом" value={true}>
                        <option value="">Всі</option>
                        <option value={true}>Видимі</option>
                        <option value={false}>Приховані</option>
                    </Control>)
                 : <Control type="switch" className="mt-2" value={true}
                 title="Дозвіл на використання" {...propsNew} />
            }
        </Form.Group>
    )
}

Status.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    as: PropTypes.string
}

export default Status