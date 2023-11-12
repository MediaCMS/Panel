import React, { useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'

export default props => {

    const handleDelete = async () => {
        if (await outletContext.setConfirm('Ви впевненні?')) {
            props.onDelete()
        }
    }

    return (
        <Form onSubmit={props.onSubmit}>
            <div className="mx-auto" style={{ maxWidth: '840px' }}>
                <div>{props.children}</div>
                <div className="text-center my-5">
                    {props?.data?._id && props?.onDelete && (
                        <Button onClick={handleDelete} variant="danger"
                            className="me-2">
                            Видалити
                        </Button>
                    )}
                    <Button type="submit">Зберегти</Button>
                </div>
            </div>
        </Form>
    )
}