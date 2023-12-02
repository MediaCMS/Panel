import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Index from './Images/Index.js'
import Editor from './Image.js'

export default function (props) {

    const [tag, setTag] = useState()
    const [tags, setTags] = useState([])
    const context = useOutletContext()

    const handleLoad = async () => {
        setTags(
            await context.api.panel.get('/tags', {
                params: { _images: true }
            })
        )
    }

    useEffect(() => handleLoad(), [])

    return <>
        <div className="tags text-center">
            {tags.map(tag => {
                let size = 'md'
                if (tag.images > 5) size = 'lg'
                if (tag.images < 3) size = 'sm'
                return (
                    <Button size={size} className="m-2" key={tag._id}
                        variant={tag.images === 1 ? 'outline-secondary' : 'outline-dark'}
                        onClick={() => setTag(tag)}>
                        <span className={tag.images > 7 ? 'fw-bold' : 'fw-normal'}>
                            {tag.title}
                        </span>
                    </Button>
                )
            })}
        </div>
        <Index tag={tag} setTag={setTag} onChange={handleLoad}
            onChoose={props.onChoose} />
        <Editor show={props.upload} onHide={() => props.setUpload(false)}
            onChange={handleLoad} title="Завантаження зображення"
            size="lg" as="modal" />
    </>
}