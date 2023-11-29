import React, { useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Menu from '../../../../components/Menu.js'
import Images from '../../../../blocks/Images.js'

export default function (props) {

    const [show, setShow] = useState(false)
    const [menu, setMenu] = useState([])

    const handleLoad = menu => {
        setMenu(menu)
    }

    const handleShow = event => {
        event.preventDefault();
        setShow(true)
    }

    const handleChoose = image => {
        props.onChange(image.name)
        setShow(false)
    }

    const handleClose = () => {
        setShow(false)
    }

    return <>
        <div>
            <span>
                <Form.Control type="file" on={handleShow}
                    title="Виберіть зображення для завантаження"
                    required={props.required ?? false} />
            </span>
            <span>
                <Button onClick={handleShow}>Бібліотека</Button>
            </span>
        </div>
        <Modal show={show} onHide={handleClose} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title className="flex-grow-1">Зображення</Modal.Title>
                <Menu items={menu} />
            </Modal.Header>
            <Modal.Body>
                <Images onChoose={handleChoose} onLoad={handleLoad} />
            </Modal.Body>
        </Modal>
    </>
}