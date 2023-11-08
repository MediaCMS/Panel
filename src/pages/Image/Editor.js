import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
//import { Form as Form2, InputGroup } from 'react-bootstrap'
import translit from 'ua-en-translit'
import Form, { Field, Row, Cell } from '../../components/Form.js'
import Control from '../../components/Form/Control.js'
import Image from './Editor/Image.js'
import Slug from './Editor/Slug.js'
//import config from '../../config.js'

export default function () {

    const [image, setImage] = useState({})
    const [file, setFile] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleChangeSlug = slug => {
        console.log('slug', slug)
        setImage(image => ({ ...image, slug }))
        slug = slug + '.jpg'
        return slug
    }

    const handleSubmit = async () => {
        console.log(image)
        if (params?.id) {
            image.slug += slugOld.substring(slugOld.lastIndexOf('.'))
            //await context.api.panel.put('/images/' + params.id, image)
            console.log(image.slug, slugOld, image.slug !== slugOld)
            if (image.slug !== slugOld) {
                //const response = await context.api.image.patch(image.slug, { slug })
                //console.log(response)
            }
        } else {
            console.log(file)
            const imageExport = { ...image }
            /*
            const formData = new FormData()
            formData.append('image', file)
            const response = await context.api.image.post('', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }}
            )
            imageExport.path = response.path
            await context.api.panel.post('/images', imageExport)
            */
        }
        navigate('/images/list')
        function createSlug(text) {
            return translit(image.title.toLowerCase())
            .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-')
        }
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/images/' + params.id)
        await context.api.image.delete('/' + image.path.substr(7, 32))
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
        console.log(params.id)
        params?.id && setImage(
            await context.api.panel.get('/images/' + params.id)
        )
    }, [])

    useEffect(async () => {
        console.log('image.file', file)
    }, [file])

    return (
        <Form data={image} onChange={setImage}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Field label="Файл зображення">
                    <Image id={params.id} slug={image.slug} onChange={setFile}/>
                </Field>
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.Title label="Заголовок зображення" required
                        placeholder="Основна інформація" />
                </Cell>
                <Cell sm="6">
                    <Field label="Назва файла зображення" >
                        <Slug value={image.slug} title={image.title} file={file}
                            onChange={handleChangeSlug}/>
                    </Field>
                </Cell>
            </Row>
            {/* 
            <Row>
                <Field.Slug source={image.title} required
                    onChangeAfter={handleChangeSlug}
                    label="Назва файла зображення" />
            </Row>
            */}
            <Row>
                <Field.Description label="Опис зображення"
                    placeholder="Додаткова інформація" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple />
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