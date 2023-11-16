import React from 'react'
import { Form } from 'react-bootstrap'
import Buttons from './Buttons/Standard.js'

export default props => {

    return (
        <Form onSubmit={props.onSubmit}>
            <div className="mx-auto" style={{ maxWidth: '840px' }}>
                <div>{props.children}</div>
                <div className="text-center my-5">
                    <Buttons {...props} />
                </div>
            </div>
        </Form>
    )
}