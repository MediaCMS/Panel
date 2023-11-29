import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import Images, { Image } from '../../components/Images.js'

export default function (props) {

    const [images, setImages] = useState([])
    const [fullScreen, setFullScreen] = useState(false)
    const [size, setSize] = useState('lg')
    const [show, setShow] = useState(!!props?.id)
    const context = useOutletContext()

    useEffect(async () => {
        if (!props?.id) return
        const images = await context.api.panel.get('/images', {
            params: { 'tagID': props.id }
        })
        setFullScreen(images.length > 5 ? true : false)
        setSize(images.length > 2 ? 'xl' : 'lg')
        setImages(images)
        setShow(true)
    }, [props.id])

    return <>
        <Modal show={show} size={size} fullscreen={fullScreen}
            onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title className="flex-grow-1">{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Images>
                    {images.map(image => (
                        <Image {...image} key={image._id}
                            onClick={() => props.onClick(image)} />
                    ))}
                </Images>
            </Modal.Body>
        </Modal>
    </>
}