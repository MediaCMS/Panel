import React, { useState } from 'react'
import { Form, Modal, Button, Row, Col } from 'react-bootstrap'
import Images from '../../../../blocks/Images.js'

export default function (props) {

    const [show, setShow] = useState(false)

    const handleUpload = async event => {
        console.log('handleUpload', event, event.target.files)
        /*
        const formData = new FormData()
        formData.append('image', event.target.files[0])
        const image = await context.api.image.post('/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }}
        )
        props.onChange(image.name)
        */
    }

    const handleChoose = image => {
        console.log('handleChoose', image)
        props.onChange(image.name)
        setShow(false)
    }

    return <>
        <Row>
            <Col sm={9}>
                <Form.Control type="file" onChange={handleUpload}
                    title="Виберіть зображення для завантаження"
                    required={props.required ?? false} />
            </Col>
            <Col sm={3}>
                <Button onClick={() => setShow(true)}
                    title="Виберіть зображення з бібліотеки">
                        Бібліотека
                </Button>
            </Col>
        </Row>
        <Modal show={show} onHide={() => setShow(false)} size="md" fullscreen={false}>
            <Modal.Header closeButton>
                <Modal.Title className="flex-grow-1">Зображення</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Images onChoose={handleChoose} />
            </Modal.Body>
        </Modal>
    </>
}