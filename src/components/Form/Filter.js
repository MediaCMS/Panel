import React, { useEffect } from 'react'
import { Form, Modal, Button } from 'react-bootstrap'

export default props => {

    const handleHide = () => {
        props.onChangeShow(false)
    }

    return (
        <Modal show={props.show} onHide={handleHide} animation={true}>
            <Form onSubmit={props.onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="filterLabel">
                        Фільтрування даних
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHide}>Закрити</Button>
                    <Button type="submit" onClick={handleHide}>Фільтрувати</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )

}