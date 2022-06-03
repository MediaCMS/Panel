"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
//import Form, { Image, Autocomplete, Switch } from "../Form.js"

export function Index() {

    const context = useOutletContext()
    const [comments, setComments] = useState({ items: [] })

    useEffect(async () => {
        context.setParams({
            title: 'Коментарі (cписок)',
            router: ['comment', 'index'],
        })
        /*
        setPhotos({ items:
            await context.api.get('/коментарі')
        })
        */
    }, [])

    return <></>
}

export function Editor() {

    const params = useParams()
    const [comment, setComment] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async data => {
        // ...
         navigate('/коментарі/список')
    }

    const handleDelete = async () => {
        // ...
        navigate('/коментарі/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Коментарі (редактор)',
            router: ['comment', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/коментарі/список' }
            ]
        })
        // ...
    }, [])

    return <></>
}

export default {Index, Editor}