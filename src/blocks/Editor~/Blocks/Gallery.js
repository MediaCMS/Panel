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
        const images = []
        for await (const file of event.target.files) {
            images.push(await props.onImage.upload(file))
        }
        props.blocks.dispatch(
            props.blocks.actions.update(props.id, { images })
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

    const handleChangeCaption = event => {
        if (event.target.textContent.length > 256) {
            props.onAlert('Довжина опису повинна бути не більше 256 символів')
        }
        props.blocks.dispatch(
            (event.target.textContent.length !== 0)
                ? props.blocks.actions.update(props.id, {
                    title: event.target.textContent
                }) : props.blocks.actions.remove(props.id, 'title')
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
    }, []);

    useEffect(() => {
        if (!props?.images) return
        const menu = [...props.menu]
        if (typeof props?.title === 'undefined') {
            menu.splice(1, 0, {
                name: 'Caption', value: 'caption', event: handleInsertCaption
            })
        }
        menu.splice(1, 0, {
            name: 'Resize', value: 'resize', event: handleResize,
            submenu: submenu.sizes.map(item => (
                (item.value === props.size) ? {...item, active: true} : item
            ))
        })
        menu.at(-1).event = handleRemove
        props.onChangeMenu(menu)
    }, [props.menu])

    return props?.images ? (
        <div className={'gallery ' + props.size}>
            <Carousel
                nextLabel="Наступний"
                prevLabel="Попередній"
                data-bs-interval="false"
                data-bs-ride="false">
                {props.images.map((image, index) => (
                    <Carousel.Item data-bs-interval="false" data-bs-ride="false" key={index}>
                        <img src={props.onImage.host + image} alt={'Зображення №' + (index + 1)} className="d-block w-100" />
                    </Carousel.Item>
                ))}
            </Carousel>
            {
                (typeof props.title !== 'undefined')
                    ?   <p  contentEditable="true"
                            suppressContentEditableWarning="true"
                            onBlur={handleChangeCaption}>
                            {props.title}
                        </p>
                    :   null
            }
        </div>
    ) : (
        <Form.Control type="file" onChange={handleUpload}
            title="Оберіть зображення для заантаження" multiple
            className="my-5 mx-auto" style={{ maxWidth: '320px' }} />
    )
}