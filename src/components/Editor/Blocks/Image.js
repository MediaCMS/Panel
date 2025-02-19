import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Carousel } from 'react-bootstrap'
import Field from '../Field.js'
import config from '../../../config.js'

const Image = ({
    title, source, author, url, size, menu, onChange, onPaste
}) => {

    const context = useOutletContext()

    const handleUpload = async event => {
        if (event.target.files.length === 0) return
        const links = []
        for await (const file of event.target.files) {
            const formData = new FormData()
            formData.append('image', file)
            links.push(
                (await context.api.image.post('', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })).name
            )
        }
        onChange('url', links.length > 1 ? links : links[0])
    }

    useEffect(() => {
        if (!url) return
        menu.dispatch(
            menu.actions.insert('resize', menu.resize)
        )
        if (!size) onChange('size', 'full')
    }, [url])

    return url
        ? <figure onPaste={onPaste}>
            <div className="image" data-size={size}>
                {Array.isArray(url)
                    ? (<Carousel slide={false} interval={null}
                        nextLabel="Наступний" prevLabel="Попередній">
                        {url.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img src={config.images.url + '/' + image} className="d-block w-100"
                                alt={'Зображення №' + (index + 1)} />
                            </Carousel.Item>
                        ))}
                    </Carousel>)
                    : <img src={config.images.url + '/' + url} alt={title} />
                }
                <div className="copyright">
                    <Field name="source" value={source}
                        title="Джерело зображення" onChange={onChange} />
                    <Field name="author" value={author}
                        title="Автор зображення" onChange={onChange} />
                </div>
            </div>
            <Field as="figcaption" name="title" value={title}
                title="Підпис зображення" onChange={onChange} />
        </figure>
        : <Form.Control type="file" onChange={handleUpload} autoFocus
            title="Оберіть зображення для заантаження" multiple
            className="my-5 mx-auto" style={{ maxWidth: '320px' }} />
}

Image.propTypes = {
    title: PropTypes.string,
    source: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.oneOfType([
        PropTypes.string, PropTypes.arrayOf(PropTypes.string)
    ]),
    size: PropTypes.string,
    menu: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onPaste: PropTypes.func
}

export default Image