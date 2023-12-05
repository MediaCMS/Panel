import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default props => {

    const context = useOutletContext()

    const handleDelete = async () => {
        if (await context.setConfirm('Ви впевненні?')) {
            props.onDelete()
            props.onHide()
        }
    }

    return (props?.as && (props.as === 'filter'))
        ? <>
            <Button variant="secondary" onClick={props.onHide}>Закрити</Button>
            <Button type="submit" onClick={props.onHide}>Фільтрувати</Button>
        </>
        : <>
            {props?.data?._id && props?.onDelete && (
                <Button onClick={handleDelete} variant="danger" className="me-2">
                    Видалити
                </Button>
            )}
            <Button type="submit" variant="success">
                Зберегти
            </Button>
        </>
}