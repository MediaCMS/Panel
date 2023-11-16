import React, { useState, useContext, useEffect } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Context from '../../../contexts/Form.js'
import { transliterate } from '../../../utils.js'

export default function (props) {

    const [name, setName] = useState('')
    const [extension, setExtension] = useState('jpg')
    const data = useContext(Context)

    const handleChange = event => {
        setName(event.target.value)
    }

    const handleFocus = event => {
        if (!props?.title || event.target.value) return
        setName(transliterate(props.title))
    }
    
    useEffect(async () => {
        if (!props.value || name) return
        const dotIndex = props.value.lastIndexOf('.')
        setName(props.value.substring(0, dotIndex))
        setExtension(props.value.substring(dotIndex + 1))
    }, [props.value])

    useEffect(async () => {
        if (!props.file) return
        const dotIndex = props.file.lastIndexOf('.')
        setExtension(
            props.file.substring(dotIndex + 1)
        )
    }, [props.file])

    useEffect(async () => {
        if (!name) return
        data.set('slug', name + '.' + extension)
    }, [name, extension])

    return (
        <InputGroup>
            <Form.Control value={name} pattern="[a-z0-9\-.]{1,128}"
                placeholder="nazva-faila-zobrajenya" onChange={handleChange}
                onFocus={handleFocus} onBlur={handleFocus} required
                title="Посилання (від 1 до 128 прописних букв, цифр, дефісів та крапок)" />
            <InputGroup.Text>.{extension}</InputGroup.Text>
        </InputGroup>
    )
    
}
