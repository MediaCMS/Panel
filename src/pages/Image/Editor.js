import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default function () {

    const [image, setImage] = useState({})
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async event => {
        if (params?.id) {
            await context.api.panel.put('/images/' + params.id, image)
        } else {
            console.log(event.target.files)
            const formData = new FormData()
            formData.append('image', event.target.files[0])
            /*
            const response = await context.api.image.post(
                config.images.api, formData, { headers: {
                    'Content-Type': 'multipart/form-data'
                }}
            )
            */
            //await context.api.panel.post('/images', image)
        }
        navigate('/images/list')
    }

    const handleDelete = async () => {
        await context.api.image.delete(
            config.images.api + '///' + image.path.substr(7, 32)
        )
        await context.api.panel.delete('/images/' + params.id)
        navigate('/images/list')
    }

    useEffect(() => {
        context.init({
            title: 'Зображення / Редактор',
            submenu: [
                { title: 'Закрити', path: '/images/list' }
            ]
        })
    }, [])

    useEffect(async () => {
        if (!params?.id) return
        const image = await context.api.panel.get('/images/' + params.id)
        setImage(image)
    }, [])

    return (
        <Form data={image} onChange={setImage}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row className="text-center">
                <div className="w-auto border p-3 my-1 mx-auto d-inline-block">{
                    image?.path
                        ? <img src={config.images.url + image.path} />
                        : <input type="file" required
                            title="Виберіть зображення для завантаження" />
                }</div>
            </Row>
            <Row>
                <Cell sm="5">
                    <Field.Title placeholder="Заголовок зображення" required />
                </Cell>
                <Cell sm="3">
                    <Field.Date label='Дата зображення' />
                </Cell>
                <Cell sm="4">
                    <Field.Status label='Видимість зображення' />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Опис зображення" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple />
            </Row>
        </Form>
     )
}