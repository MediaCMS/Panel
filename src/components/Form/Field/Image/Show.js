import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Editor from '../../../../blocks/Image.js'
import config from '../../../../config.js'
import '../../../../assets/styles/components/fields/image.css'

const Show = props => {

    const [image, setImage] = useState()
    const [editor, setEditor] = useState(false)
    const context = useOutletContext()

    const handleLoad = () => {
        if (!props?.name) return
        setImage({ name: props.name })
        if (!props?.onChange) return
        (async () => {
            const images = await context.api.panel.get('/images', {
                params: { name: props.name }}
            )
            if (!images.length) return
            setImage(images[0])
        })()
    }

    useEffect(handleLoad, [props.name])

    const menu = props.onChange &&
        <div className={props?.className ?? 'menu'}>
            {!image?._id &&
                <Button variant="success" onClick={() => setEditor(true)}
                    title="Зберегти зображення в бібліотеці зображень"
                    className="me-2">
                    Зберегти
                </Button>
            }
            <Button variant="danger" onClick={() => props.onChange(null)}
                title="Видалити зображення з поточного документа">
                Видалити
            </Button>
        </div>

    return <>
        {props?.as === 'menu' ? menu : <div className="image">
            <img src={config.images.url + '/' + image?.name + '?width=765'} />
            {menu}
        </div>}
        {editor && <Editor image={image} onChange={handleLoad}
            show={editor} onHide={() => setEditor(false)}
            title="Редагування зображення" />}
    </>
}

Show.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string,
    as: PropTypes.string
}

export default Show