import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Tags from './Images/Tags.js'
import Index from './Images/Index.js'
import Upload from './Image.js'

export default function (props) {

    const [tag, setTag] = useState({})
    const [tags, setTags] = useState([])
    const [image, setImage] = useState({})
    const [upload, setUpload] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setTags(
            await context.api.panel.get('/tags', {
                params: { _images: true }
            })
        )
    }

    const handleChoose = async image => {
        console.log(image)
        setImage(image)
        setUpload(true)
    }

    useEffect(async () => {
        props.onLoad([
            { title: 'Завантажити', onClick: () => setUpload(true) },
        ])
        handleLoad()
    }, [])

    return <>
        <Tags items={tags} onClick={setTag} />
        <Index id={tag._id} title={tag.title} onClick={handleChoose} />
        <Upload id={image._id} show={upload} title="Редагування зображення"
            onChangeShow={setUpload} onSubmit={handleLoad} size="lg" as="modal" />
    </>
}