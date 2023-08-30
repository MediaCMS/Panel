import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

export default function (props) {

    const { className, label, ...propsNew } = {
        name: 'status', ...props
    }

    return (
        <Form.Group className={props.className}>
            <Form.Label>{props.label ?? 'Статус'}</Form.Label>
            {(props?.as && props.as === 'select')
                 ? (<Control type="select" {...propsNew} title="Фільтр за статусом" >
                        <option value="">Всі</option>
                        <option value={true}>Видимі</option>
                        <option value={false}>Приховані</option>
                    </Control>)
                 : <Control type="switch" className="mt-2"
                 title="Дозвіл на використання" {...propsNew} />
            }
        </Form.Group>
    )
}