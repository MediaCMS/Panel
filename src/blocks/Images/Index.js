import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useOutletContext } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import Images, { Image } from '../../components/Images.js'
import Editor from '../Image.js'

const Index = ({ tag, setTag, onChange, onChoose }) => {

    const [image, setImage] = useState({})
    const [images, setImages] = useState([])
    const [fullScreen, setFullScreen] = useState(false)
    const [editor, setEditor] = useState(false)
    const [size, setSize] = useState('lg')
    const context = useOutletContext()

    const handleLoad = () => {
        if (!tag) return
        (async () => {
            const images = await context.api.panel.get('/images', {
                params: { 'tagID': tag._id }
            })
            if (images.length) {
                setFullScreen(images.length > 5 ? true : false)
                setSize(images.length > 2 ? 'xl' : 'lg')
                setImages(images)
            } else {
                setTag()
            }
            onChange()
        })()
    }

    const handleClick = async image => {
        if (onChoose) {
            onChoose(image)
        } else {
            setImage(image)
            setEditor(true)
        }
    }

    useEffect(handleLoad, [tag])

    return <>
        <Modal show={!!tag} size={size} fullscreen={fullScreen}
            onHide={() => setTag()}>
            <Modal.Header closeButton>
                <Modal.Title className="flex-grow-1">{tag.title}</Modal.Title>
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

Index.propTypes = {
    tag: PropTypes.object,
    setTag: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onChoose: PropTypes.func
}

export default Index