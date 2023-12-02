import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import Images, { Image } from '../../components/Images.js'
import Editor from '../Image.js'

export default function (props) {

    const [image, setImage] = useState({})
    const [images, setImages] = useState([])
    const [fullScreen, setFullScreen] = useState(false)
    const [editor, setEditor] = useState(false)
    const [size, setSize] = useState('lg')
    const context = useOutletContext()

    const handleLoad = async () => {
        //if (!props.tag) return
        const images = await context.api.panel.get('/images', {
            params: { 'tagID': props.tag._id }
        })
        if (images.length) {
            setFullScreen(images.length > 5 ? true : false)
            setSize(images.length > 2 ? 'xl' : 'lg')
            setImages(images)
        } else {
            props.setTag()
        }
        props.onChange()
    }

    const handleClick = async image => {
        if (props.onChoose) {
            props.onChoose(image)
        } else {
            setImage(image)
            setEditor(true)
        }
    }

    useEffect(() => handleLoad(), [props.tag])

    return <>
        <Modal show={!!props.tag} size={size} fullscreen={fullScreen}
            onHide={() => props.setTag()}>
            <Modal.Header closeButton>
                <Modal.Title className="flex-grow-1">{props.tag.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Images>
                    {images.map(image => (
                        <Image {...image} key={image._id}
                            onClick={() => handleClick(image)} />
                    ))}
                </Images>
            </Modal.Body>
        </Modal>
        <Editor id={image._id} show={editor} onHide={() => setEditor(false)}
            onChange={handleLoad} title="Редагування зображення" />
    </>
}