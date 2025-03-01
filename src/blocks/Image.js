import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row } from '../components/Form.js'
import Image from '../components/Form/Field/Image.js'

const ImageWrapper = props => {

    const [image, setImage] = useState(props?.image ?? {})
    const context = useOutletContext()

    const handleSubmit = async () => {
        if (image?._id) {
            await context.api.panel.put('/images/' + image._id, image)
        } else {
            await context.api.panel.post('/images', image)
        }
        if (props?.onChange) props.onChange()
        props.onHide()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/images/' + image._id)
        props.onChange()
        props.onHide()
        setImage({})
    }

    useEffect( () => {
        props?.id && (async () => 
            setImage(
                await context.api.panel.get(
                    '/images/' + props.id
                )
            )
        )()
    }, [props.id])

    return (
        <Form {...props} data={image} onChange={setImage} size="lg" 
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Image name="name" label="Файл зображення" required />
            </Row>
            <Row>
                <Field.Title label="Заголовок зображення" required
                    placeholder="Львівська ратуша" />
            </Row>
            <Row>
                <Field.Text name="source" label="Джерело зображення"
                    placeholder="facebook.com" />
            </Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки зображення"
                    path="/tags" multiple required />
            </Row>
        </Form>
    )
}

ImageWrapper.propTypes = {
    image: PropTypes.object,
    id: PropTypes.string,
    onChange: PropTypes.func,
    onHide: PropTypes.func
}

export default ImageWrapper