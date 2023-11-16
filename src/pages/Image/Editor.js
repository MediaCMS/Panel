import React, { useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import Editor from '../../blocks/Image.js'

export default function () {

    const context = useOutletContext()
    const params = useParams()

    useEffect(() => {
        context.init({
            title: 'Зображення / Редактор',
            submenu: [
                { title: 'Закрити', path: '/images/list' }
            ]
        })
    }, [])

    return <Editor id={params.id} navigate="/images/list" />
}