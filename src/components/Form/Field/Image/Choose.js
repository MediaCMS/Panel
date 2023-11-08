import React, { useState, useContext, useEffect } from 'react'
//import { useOutletContext } from 'react-router-dom'
import { Form, Modal, Button } from 'react-bootstrap'
//import Context from '../../../../contexts/Form.js'
import Images from '../../../../blocks/Images.js'
import config from '../../../../config.js'

export default function (props) {

   // const [image, setImage] = useState({})
    const [show, setShow] = useState(false)
    const [init, setInit] = useState()
    //const context = useOutletContext()

    const handleShow = event => {
        event.preventDefault();
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleChoose = image => {
        props.onChange(props.image._id)
        setShow(false)
    }

    const handleDelete = () => {
        props.onChange(null)
    }

    const handleLoad = init => {
        init.submenu[0].onClick = () => setEdit(true)
        setInit(init)
    }
/*
    useEffect(async () => {
        setImage(
            props?.value
                ? await context.api.panel.get('/images/' + props.value)
                : {}
        )
    }, [props.value])
*/
    return props?.image
        ? (
            <div className="image">
                <div className="delete">
                    <img src={config.images.url + '/' + props.image.slug}
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