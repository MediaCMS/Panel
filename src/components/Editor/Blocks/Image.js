import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Carousel } from 'react-bootstrap'
import Field from '../Field.js'
import config from '../../../config.js'

export default props => {

    const context = useOutletContext()

    const handleUpload = async event => {
        if (event.target.files.length === 0) return
        let url = []
        for await (const file of event.target.files) {
            const formData = new FormData()
            formData.append('image', file)
            url.push(
                (await context.api.image.post('', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })).name
            )
        }
        props.onChange('url', url.length > 1 ? url : url[0])
        console.log(url)
    }
/*
    const handleRemove = async () => {
        const images = Array.isArray(props.url)
            ? props.url : [props.url]
        for await (const image of images) {
            await context.api.image.delete(
                null, { params: { image } }
            )
        }
        props.onChange()
    }
*/
    useEffect(() => {
        if (!props?.url) return
        props.menu.dispatch(
            props.menu.actions.insert('resize', props.menu.resize)
        )
        if (!props?.size) props.onChange('size', 'full')
    }, [props.url])

    return props?.url ? (
        <figure onPaste={props.onPaste}>
            <div className="image" data-size={props.size}>
                {Array.isArray(props.url)
                    ? (<Carousel
                        nextLabel="Наступний"
                        prevLabel="Попередній"
                        data-bs-interval="false"
                        data-bs-ride="false">
                            {props.url.map((image, index) => (
                            <Carousel.Item data-bs-interval="false" data-bs-ride="false" key={index}>
                                    <img src={config.images.url + '/' + image} className="d-block w-100"
                                    alt={'Зображення №' + (index + 1)} />
                            </Carousel.Item>
                        ))}
                    </Carousel>)
                    : <img src={config.images.url + '/' + props.url} alt={props.title} />
                }
                <Field as="span" name="source" value={props.source}
                    title="Джерело зображення" onChange={props.onChange} />
                <Field as="span" name="author" value={props.author}
                    title="Автор зображення" onChange={props.onChange} />
            </div>
            <Field as="figcaption" name="title" value={props.title}
                title="Підпис зображення" onChange={props.onChange} />
        </figure>
    ) : (
        <Form.Control type="file" onChange={handleUpload}
            title="Оберіть зображення для заантаження" multiple
            className="my-5 mx-auto" style={{ maxWidth: '320px' }} />
    )
}