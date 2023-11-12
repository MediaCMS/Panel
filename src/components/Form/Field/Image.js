import React, { useState, useContext, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Modal, Button } from 'react-bootstrap'
import Submenu from '../../../layouts/Main/Submenu.js'
import Context from '../../../contexts/Form.js'
import Images from '../../../blocks/Images.js'
import Field from './Field.js'
import config from '../../../config.js'
import '../../../assets/styles/components/fields/image.css'

export default function (props) {

    const [image, setImage] = useState({})
    const [show, setShow] = useState(false)
    const [init, setInit] = useState({})
    const context = useOutletContext()
    const data = useContext(Context)
    const name = props?.name ?? 'image'
    const value = data.get(name)

    const handleChange = value => {
        data.set(name, value)
    }

    const handleShow = event => {
        event.preventDefault();
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleChoose = image => {
        data.set(name, image._id)
        setShow(false)
    }

    const handleDelete = () => {
        data.set(name, null)
    }

    const handleLoad = init => {
        init.submenu[0].onClick = () => setEdit(true)
        setInit(init)
    }

    useEffect(async () => {
        setImage(
            value ? await context.api.panel.get('/images/' + value) : {}
        )
    }, [value])

    return (
        <Field label={props?.label ?? 'Зображення'}>
            {image?.slug
                ? (
                    <div className="image">
                        <div className="delete">
                            <img src={config.images.url + '/' + image.slug}
                                onClick={handleDelete} title="Видалити зображення"
                                className="mw-100" />
                        </div>
                    </div>
                )
                : (<>
                    <Form.Control type="file" onClick={handleShow}
                        required={props.required ?? false}
                        title="Вибрати зображення" />
                    <Modal show={show} onHide={handleClose} /*size="xl"*/ fullscreen={true}>
                        <Modal.Header closeButton>
                            <Modal.Title className="flex-grow-1">{init.title}</Modal.Title>
                            <Submenu items={init.submenu} setConfirm={context.setConfirm} />
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
        </Field>
    )
}