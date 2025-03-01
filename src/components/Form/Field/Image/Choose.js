import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Modal, Button, Row, Col } from 'react-bootstrap'
import Images from '../../../../blocks/Images.js'
import config from '../../../../config.js'

const Choose = props => {

    const [library, setLibrary] = useState(false)
    const context = useOutletContext()

    const handleUpload = async event => {
        if (!event.target.files.length) return
        const file = event.target.files[0]
        if (!(file.type in config.images.types)) {
            event.target.value = null
            context.setAlert(
                `Заборонений тип файлу зображення`
            )
            return
        }
        if (file.size > config.images.size) {
            event.target.value = null
            context.setAlert(
                `Розмір файлу зображення більше дозволеного`
            )
            return
        }
        const formData = new FormData()
        formData.append('image', file)
        const image = await context.api.image.post('/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }}
        )
        props.onChange(image.name)
    }

    const handleChoose = image => {
        props.onChange(image.name)
        setLibrary(false)
    }

    return <>
        <Row>
            <Col>
                <Form.Control type="file" onChange={handleUpload}
                    title="Виберіть зображення для завантаження"
                    required={props.required ?? false} />
            </Col>
            {props.library && 
                <Col sm={3}>
                    <Button onClick={() => setLibrary(true)}
                        title="Виберіть зображення з бібліотеки">
                            Бібліотека
                    </Button>
                </Col>
            }
        </Row>
        <Modal show={library} onHide={() => setLibrary(false)}
            size="md" fullscreen={false}>
            <Modal.Header closeButton>
                <Modal.Title className="flex-grow-1">Зображення</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Images onChoose={handleChoose} />
            </Modal.Body>
        </Modal>
    </>
}

Choose.propTypes = {
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    library: PropTypes.bool
}

export default Choose