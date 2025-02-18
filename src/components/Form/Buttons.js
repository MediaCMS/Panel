import PropTypes from 'prop-types'
import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Buttons = ({ as, data, onDelete, onHide }) => {

    const context = useOutletContext()

    const handleDelete = async () => {
        if (await context.setConfirm('Ви впевненні?')) {
            onDelete()
            onHide()
        }
    }

    return (as && (as === 'filter'))
        ? <>
            <Button variant="secondary" onClick={onHide}>Закрити</Button>
            <Button type="submit">Фільтрувати</Button>
        </>
        : <>
            {data?._id && onDelete && (
                <Button onClick={handleDelete} variant="danger" className="me-2">
                    Видалити
                </Button>
            )}
            <Button type="submit" variant="success">
                Зберегти
            </Button>
        </>
}

Buttons.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string,
    }),
    as: PropTypes.string,
    onDelete: PropTypes.func,
    onHide: PropTypes.func,
}

export default Buttons