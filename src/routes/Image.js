"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
//import Form, { Image, Autocomplete, Switch } from "../Form.js"

export function Index() {

    const context = useOutletContext()
    const [photos, setPhotos] = useState({ items: [] })

    useEffect(async () => {
        context.setParams({
            title: 'Фото (cписок)',
            router: ['photo', 'index'],
            submenu: [
                { title: 'Завантажити', url: '/фото/редактор' }
            ]
        })
        /*
        setPhotos({ items:
            await context.api.get('/фото')
        })
        */
    }, [])

    return <></>
}

export function Editor() {

    const params = useParams()
    const [photo, setPhoto] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async data => {
        // ...
         navigate('/фото/список')
    }

    const handleDelete = async () => {
        // ...
        navigate('/фото/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Фото (редактор)',
            router: ['photo', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/фото/список' }
            ]
        })
        // ...
    }, [])

    return <></>
}

export default {Index, Editor}