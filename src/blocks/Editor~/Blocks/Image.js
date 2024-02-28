'use strict'

import React, { useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import { Form } from 'react-bootstrap'

const submenu = {
    sizes: [
        { name: 'Small', value: 'small' },
        { name: 'Medium', value: 'medium' },
        { name: 'Large', value: 'large' },
        { name: 'Full', value: 'full' }
    ]
}

export default function Gallery(props) {

    const handleUpload = async event => {
        if (event.target.files.length === 0) return
        let url = []
        for await (const file of event.target.files) {
            url.push(await props.onImage.upload(file))
        }
        if (url.length === 1) {
            url = event.target.files[0]
        }
        props.blocks.dispatch(
            props.blocks.actions.update(props.id, { url })
        )
    }

    const handleRemove = async () => {
        for await (const image of props.images) {
            await props.onImage.remove(image)
        }
        props.blocks.dispatch(
            props.blocks.actions.remove(props.id)
        )
    }

    const handleInsertCaption = () => {
        props.blocks.dispatch(
            props.blocks.actions.update(props.id, {title: ''})
        )
    }

    const handleInsertSource = () => {
        props.blocks.dispatch(
            props.blocks.actions.update(props.id, { source: '' })
        )
    }

    const handleInsertAuthor = () => {
        props.blocks.dispatch(
            props.blocks.actions.update(props.id, { author: '' })
        )
    }

    const handleChangeCaption = event => {
        if (event.target.textContent.length > 256) {
            props.onAlert('Довжина опису зображення повинна бути не більше 256 символів')
        }
        props.blocks.dispatch(
            (event.target.textContent.length !== 0)
                ? props.blocks.actions.update(props.id, { title: event.target.textContent })
                : props.blocks.actions.remove(props.id, 'title')
        )
    }

    const handleChangeSource = event => {
        if (event.target.textContent.length > 64) {
            props.onAlert('Довжина джерела зображення повинна бути не більше 64 символів')
        }
        props.blocks.dispatch(
            (event.target.textContent.length !== 0)
                ? props.blocks.actions.update(props.id, { source: event.target.textContent })
                : props.blocks.actions.remove(props.id, 'source')
        )
    }

    const handleChangeAuthor = event => {
        if (event.target.textContent.length > 64) {
            props.onAlert('Довжина автора зображення повинна бути не більше 64 символів')
        }
        props.blocks.dispatch(
            (event.target.textContent.length !== 0)
                ? props.blocks.actions.update(props.id, { author: event.target.textContent })
                : props.blocks.actions.remove(props.id, 'author')
        )
    }

    const handleResize = (id, size) => {
        props.blocks.dispatch(
            props.blocks.actions.update(id, { size })
        )
    }

    useEffect( () => {
        if (!props?.size) {
            props.blocks.dispatch(
                props.blocks.actions.update(props.id, {
                    size: 'medium'
                })
            )
        }
    }, [])

    useEffect(() => {
        if (!props?.url) return
        const menu = [...props.menu]
        menu.splice(1, 0, {
            name: 'Size', value: 'size', event: handleResize,
            submenu: submenu.sizes.map(item => (
                (item.value === props.size) ? {...item, active: true} : item
            ))
        })
        submenu.text = []
        if (typeof props?.title === 'undefined') {
            submenu.text.push({
                name: 'Caption', value: 'caption', event: handleInsertCaption
            })
        }
        if (typeof props?.source === 'undefined') {
            submenu.text.push({
                name: 'Source', value: 'source', event: handleInsertSource
            })
        }
        if (typeof props?.author === 'undefined') {
            submenu.text.push({
                name: 'Author', value: 'author', event: handleInsertAuthor
            })
        }
        if (submenu.text.length) {
            menu.splice(1, 0, { name: 'Text', value: 'text', submenu: submenu.text })
        }
        menu.at(-1).event = handleRemove
        props.onChangeMenu(menu)
    }, [props.menu])

    return props?.url ? (
        <figure>
            <div className={'image ' + props.size}>
                {Array.isArray(props.url)
                    ? (<Carousel
                        nextLabel="Наступний"
                        prevLabel="Попередній"
                        data-bs-interval="false"
                        data-bs-ride="false">
                            {props.url.map((image, index) => (
                            <Carousel.Item data-bs-interval="false" data-bs-ride="false" key={index}>
                                <img src={props.onImage.host + image} className="d-block w-100"
                                    alt={'Зображення №' + (index + 1)} />
                            </Carousel.Item>
                        ))}
                    </Carousel>)
                    : <img src={props.onImage.host + props.url} alt={props.title} />
                } 
                {typeof props.source !== 'undefined'
                    ? <span onBlur={handleChangeSource} contentEditable="true" title="Source"
                        suppressContentEditableWarning="true" className="source">
                        {props.source}
                    </span>
                    : null}
                {typeof props.author !== 'undefined'
                    ? <span onBlur={handleChangeAuthor} contentEditable="true" title="Author"
                        suppressContentEditableWarning="true" className="author">
                        {props.author}
                    </span>
                    : null}
            </div>
            {typeof props.title !== 'undefined'
                ? <figcaption onBlur={handleChangeCaption} contentEditable="true"
                    suppressContentEditableWarning="true">
                    {props.title}
                </figcaption>
                :   null}
        </figure>
    ) : (
        <Form.Control type="file" onChange={handleUpload}
            title="Оберіть зображення для заантаження" multiple
            className="my-5 mx-auto" style={{ maxWidth: '320px' }} />
    )
}