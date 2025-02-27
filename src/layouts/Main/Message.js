import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

const Message = ({ 
    type, title, body, onFalse, onTrue, setMessage
}) => {

    const handleClose = () => {
        setMessage(null)
    }

    return (
        <Modal show={type} onHide={handleClose}
            size={React.isValidElement(body) ? 'lg' : 'md'}>
            <Modal.Header closeButton>
                <Modal.Title>{title ?? 'Повідомлення'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {React.isValidElement(body) ? body : <p>{body}</p>}
            </Modal.Body>
            <Modal.Footer>
                {type === 'alert' ? (
                    <Button variant="primary" onClick={handleClose}>Зрозуміло</Button>
                ) : (
                    <>
                        <Button variant="secondary" onClick={() => {
                            onFalse && onFalse()
                            handleClose()
                        }}>Ні, дякую</Button>
                        <Button variant="primary" onClick={() => {
                            onTrue()
                            handleClose()
                        }}>Гаразд</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}

Message.propTypes = {
    type: PropTypes.string,
    body: PropTypes.oneOfType([
        PropTypes.string, PropTypes.element
    ]),
    title: PropTypes.string,
    onFalse: PropTypes.func,
    onTrue: PropTypes.func,
    setMessage: PropTypes.func.isRequired
}

export default Message