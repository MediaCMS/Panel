import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function (props) {

    const handleClose = () => {
        props.setMessage(null)
    }

    return (
        <Modal show={!!props?.type} onHide={handleClose}
            size={React.isValidElement(props.body) ? 'lg' : 'md'}>
            <Modal.Header closeButton>
                <Modal.Title>{props?.title ?? 'Повідомлення'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {React.isValidElement(props.body) ? props.body : <p>{props.body}</p>}
            </Modal.Body>
            <Modal.Footer>
                {props.type === 'alert' ? (
                    <Button variant="primary" onClick={handleClose}>Зрозуміло</Button>
                ) : (
                    <>
                        <Button variant="secondary" onClick={() => {
                            props?.onFalse && props.onFalse()
                            handleClose()
                        }}>Ні, дякую</Button>
                        <Button variant="primary" onClick={() => {
                            props.onTrue()
                            handleClose()
                        }}>Гаразд</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}