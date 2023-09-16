import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
//import Form, { Image, Autocomplete, Switch } from '../Form.js'

export function Index() {

    const context = useOutletContext()
    const [images, setImages] = useState([])

    useEffect(async () => {
        context.setParams({
            title: 'Зображення (cписок)',
            submenu: [
                { title: 'Завантажити', url: '/images/editor' }
            ]
        })
        /*
        setImages(
            await context.api.get('/images')
        )
        */
    }, [])

    return <></>
}

export function Editor() {

    const params = useParams()
    const [images, setImages] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async data => {
        // ...
         navigate('/images/list')
    }

    const handleDelete = async () => {
        // ...
        navigate('/images/list')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Фото (редактор)',
            submenu: [
                { title: 'Закрити', url: '/images/list' }
            ]
        })
        // ...
    }, [])

    return <></>
}

export default { Index, Editor }