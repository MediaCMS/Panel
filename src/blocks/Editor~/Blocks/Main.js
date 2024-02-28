'use strict'

import React, { useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'

export default function (props) {

    const handleChangeTitle = event => {
        props.blocks.dispatch(
            props.blocks.actions.update(
                props.id, { title: event.target.textContent }
            )
        )
    }

    const handleImageUpload = async event => {
        if (event.target.files.length !== 1) return
        props.blocks.dispatch(
            props.blocks.actions.update(props.id, { image: 
                await props.onImage.upload(event.target.files[0])
            })
        )
    }

    const handleImageRemove = async () => {
        await props.onImage.remove(props.image)
        props.blocks.dispatch(
            props.blocks.actions.remove(props.id, 'image')
        )
    }

    useEffect(() => {
        props.onChangeMenu([...props.menu].slice(0, 1))
    }, [props.menu])

    return (
        <div className={'main' + (props?.image ? ' image' : '')}
            style={{ backgroundImage: props?.image 
                ?`url(${props.onImage.host + props.image})` : ''}}>
            <h1 contentEditable="true"
                suppressContentEditableWarning="true"
                onBlur={handleChangeTitle}
                style={{
                    font: '600 calc(16px + 10vw) "Lora", serif', 
                    border: props?.image ? 'none' : 'dashed 1px grey; margin: 1em'
                }}>
                {props.title}
            </h1>
            <span className="text-center position-absolute mx-auto"
                style={{ maxWidth: '360px', bottom: '3vh' }}>
                {props?.image
                    ? <Button variant="outline-danger"
                        onClick={handleImageRemove}>Remove image</Button>
                    : <Form.Control type="file" onChange={handleImageUpload}
                        title="Оберіть файл для завантаження" />
                }
            </span>
        </div>
    )
}