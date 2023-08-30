import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

export default function (props) {

    const { className, label, ...propsNew } = { ...props }

    return (
        <Form.Group className={props.className}>
            {props?.children
                 ?  (<>
                        <Form.Label>{props.label ?? 'Сортування (поле)'}</Form.Label>
                        <Control type="select" name="_sortField"
                            title="Сортування за полем" {...propsNew} >
                            {propsNew.children}
                        </Control>
                    </>)
                 :  (<>
                        <Form.Label>{props.label ?? 'Сортування (напрям)'}</Form.Label>
                        <Control type="select" name="_sortOrder"
                            title="Напрям сортування" {...propsNew} >
                            <option value={1}>Низхідний</option>
                            <option value={-1}>Виcхідний</option>
                        </Control>
                    </>)
            }
        </Form.Group>
    )
}