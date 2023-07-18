"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
//import Form, { Image, Autocomplete, Switch } from "../Form.js"

export function Index() {

    const context = useOutletContext()
    const [types, setTypes] = useState({ items: [] })

    useEffect(async () => {
        context.setParams({
            title: 'Тип / Список',
            router: ['type', 'index'],
            submenu: [
                { title: 'Створити', url: '/тип/редактор' }
            ]
        })
        /*
        setTypes({ items:
            await context.api.get('/тип')
        })
        */
    }, [])

    return <></>
}

export function Editor() {

    const params = useParams()
    const [type, setType] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async data => {
        // ...
        navigate('/тип/список')
    }

    const handleDelete = async () => {
        // ...
        navigate('/тип/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Тип (редактор)',
            router: ['photo', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/тип/список' }
            ]
        })
        // ...
    }, [])

    return <></>
}

export default {Index, Editor}