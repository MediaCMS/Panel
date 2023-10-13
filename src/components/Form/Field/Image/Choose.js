import React, { useState, useContext } from 'react'
import { Form, Modal, Button } from 'react-bootstrap'
//import Images from '../../../../blocks/Images.js'
import Context from '../../../../contexts/Form.js'
import config from '../../../../config.js'

export default function (props) {

    const [show, setShow] = useState(false)
    const [init, setInit] = useState()
    const data = useContext(Context)
    const name = props.name ?? 'image'
    const value = data.get(name)

    const handleShow = event => {
        console.log('Choose.handleShow')
        event.preventDefault();
        setShow(true)
     }

    const handleDelete = () => {
        console.log('Choose.handleDelete')
    }

    const handleClick = image => {
        console.log('Choose.handleClick', image)
        data.set(name, image.path)
    }

    const handleLoad = init => {
        console.log('Choose.handleLoad', init)
        init.submenu[0].onClick = () => setEdit(true)
        setInit(init)
    }

    return value
        ? <img src={config.images.url + value} onClick={handleDelete}
            title="Видалити зображення" />
        : (<>
            <Form.Control type="file" onClick={handleShow}
            required={props.required ?? false}
            title="Вибрати зображення" />
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{init?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* 
                    <Images onClick={handleClick} onLoad={handleLoad} />
                    */}
                </Modal.Body>
                <Modal.Footer>{init?.title}</Modal.Footer>
            </Modal>
        </>)
}