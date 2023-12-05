import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Editor from '../../../../blocks/Image.js'
import config from '../../../../config.js'
import '../../../../assets/styles/components/fields/image.css'

export default function (props) {

    const [image, setImage] = useState({ name: props.name })
    const [editor, setEditor] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        if (!props?.name || !props?.onChange) return
        const images = await context.api.panel.get('/images', {
            params: { name: props.name }}
        )
        if (!images.length) return
        setImage(images[0])
    }

    useEffect(handleLoad, [props.name])

    return <>
        <div className="image">
            <img src={config.images.url + '/' + image?.name} />
            {props.onChange &&
                <div className="menu">
                    {image._id
                        ? <Button variant="danger" onClick={() => props.onChange(null)}
                            title="Видалити зображення з поточного документа">
                            Видалити
                        </Button>
                        : <Button variant="success" onClick={() => setEditor(true)}
                            title="Зберегти зображення в бібліотеці зображень">
                            Зберегти
                        </Button>
                    }
                </div>
            }
        </div>
        {editor && <Editor image={image} onChange={handleLoad}
            show={editor} onHide={() => setEditor(false)}
            title="Редагування зображення" />}
    </>
}