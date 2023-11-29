import React, { useState, useEffect, createElement } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../components/Form.js'
import Image from './Image/Image.js'

export default function (props) {

    const [image, setImage] = useState({})
    const [file, setFile] = useState({})
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (image?._id) {
            await context.api.panel.put('/images/' + image._id, image)
        } else {
            const formData = new FormData()
            formData.append('image', file)
            await context.api.image.post('/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }}
            )
            await context.api.panel.post('/images', image)
        }
        handleClose()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/images/' + image._id)
    }

    const handleClose = () => {
        if (props?.navigate) navigate(props.navigate)
        if (props?.onChangeShow) props.onChangeShow(false)
        if (props?.onSubmit) props.onSubmit()
    }

    useEffect(async () => {
        props?.id && setImage(
            await context.api.panel.get('/images/' + props.id)
        )
    }, [props.id])

    return (
        <Form {...props} data={image} onChange={setImage} 
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Field label="Файл зображення">
                    <Image id={image._id} name={image.name} required
                        onChange={setFile} />
                </Field>
            </Row>
            <Row>
                <Field.Title label="Заголовок зображення" required
                    placeholder="Основна інформація" />
            </Row>
            <Row>
                <Field.Description label="Опис зображення"
                    placeholder="Додаткова інформація" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple required />
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.DateTime label="Дата зображення" />
                </Cell>
                <Cell sm="4">
                    <Field.Status label="Видимість зображення" />
                </Cell>
            </Row>
        </Form>
     )
}