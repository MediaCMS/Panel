import React, { useState, useEffect } from 'react'
import translit from 'ua-en-translit'
import { Form, InputGroup } from 'react-bootstrap'
import Context from '../../../contexts/Form.js'
import Field from '../../../components/Form/Field/Field.js'
import config from '../../../config.js'

export default function (props) {

    const [name, setName] = useState('')
    const [extension, setExtension] = useState('jpg')

    const handleChange = event => {
        setName(event.target.value)
    }

    const handleFocus = event => {
        if (!props?.title || event.target.value) return
        const name = translit(props.title.toLowerCase())
            .replace(/[^a-z0-9- ]/g, '').replace(/\s+/g, '-')
        setName(name)
    }

    useEffect(async () => {
        console.log('image.slug.value', props.value)
        if (!props.value) return
        const dotIndex = value.lastIndexOff('.')
        setName(value.substring(0, dotIndex))
        setExtension(value.substring(dotIndex))
    }, [props.value])
/*
    useEffect(async () => {
        console.log('image.slug.title', props.title)
    }, [props.title])
*/
    useEffect(async () => {
        console.log('image.slug.file', props.file)
    }, [props.file])

    return (
        <InputGroup className="mb-3">
            <Form.Control value={name} pattern="[a-z0-9\-]{1,128}"
                placeholder="nazva-faila-zobrajenya" onChange={handleChange}
                onFocus={handleFocus} onBlur={handleFocus} required
                title="Посилання (від 1 до 128 прописних букв, цифр та дефісів)" />
            <InputGroup.Text>.{extension}</InputGroup.Text>
        </InputGroup>
    )
/*
    return <Field type="text" name={name}
        
        
        
        {...propsNew} />
*/
    
}
