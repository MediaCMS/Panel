import React, { useState, useContext } from 'react'
import { Form, Modal, Button } from 'react-bootstrap'
import Images from '../../../../blocks/Images.js'
import Context from '../../../../contexts/Form.js'
import config from '../../../../config.js'

export default function (props) {

    const [show, setShow] = useState(false)
    const [init, setInit] = useState()
    const data = useContext(Context)
    const name = props.name ?? 'image'
    const value = data.get(name)

    const handleShow = event => {
        event.preventDefault();
        setShow(true)
     }

     const handleClose = () => {
        setShow(false)
     }

    const handleChoose = image => {
        data.set(name, image.path)
        setShow(false)
    }

    const handleDelete = () => {
        data.set(name, null)
    }

    const handleLoad = init => {
        console.log('Choose.handleLoad', init)
        init.submenu[0].onClick = () => setEdit(true)
        setInit(init)
    }

    return value
        ? (
            <div className="image">
                <div className="delete">
                    <img src={config.images.url + value} onClick={handleDelete}
                    title="Видалити зображення" className="mw-100" />
                </div>
            </div>
        )
        : (<>
            <Form.Control type="file" onClick={handleShow}
            required={props.required ?? false}
            title="Вибрати зображення" />
            <Modal show={show} onHide={handleClose} /*size="xl"*/ fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{init?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Images onChoose={handleChoose} onLoad={handleLoad} />
                </Modal.Body>
                {/*
                <Modal.Footer>
                    <Button onClick={handleClose}>Закрити</Button>
                </Modal.Footer>
                */}
            </Modal>
        </>)
}