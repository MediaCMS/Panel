import PropTypes from 'prop-types'
import React from 'react'
import { Form } from 'react-bootstrap'
import Control from '../Control.js'

const Sort = props => {

    // eslint-disable-next-line no-unused-vars
    const { className, label, ...propsNew } = { ...props }

    return (
        <Form.Group className={props.className}>
            {props?.children
                 ?  (<>
                        <Form.Label>{props.label ?? 'Поле сортування'}</Form.Label>
                        <Control type="select" name="_sort.field"
                            title="Сортування за полем" {...propsNew} >
                            {propsNew.children}
                        </Control>
                    </>)
                 :  (<>
                        <Form.Label>{props.label ?? 'Напрям сортування'}</Form.Label>
                        <Control type="select" name="_sort.order"
                            title="Напрям сортування" {...propsNew} >
                            <option value={1}>Низхідний</option>
                            <option value={-1}>Виcхідний</option>
                        </Control>
                    </>)
            }
        </Form.Group>
    )
}

Sort.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node
}

export default Sort