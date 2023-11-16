import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default props => {

    const context = useOutletContext()

    const handleDelete = async () => {
        if (await context.setConfirm('Ви впевненні?')) {
            props.onDelete()
        }
    }

    return <>
        {props?.data?._id && props?.onDelete && (
            <Button onClick={handleDelete} variant="danger" className="me-2">
                Видалити
            </Button>
        )}
        <Button type="submit">Зберегти</Button>
    </>
}