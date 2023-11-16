import React from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Images from '../../blocks/Images.js'

export default function () {

    const context = useOutletContext()
    const navigate = useNavigate()

    const handleChoose = image => {
        navigate('/images/editor/' + image._id)
    }

    const handleLoad = menu => {
        menu[0].path = '/images/editor'
        context.init({
            title: 'Зображення / Список',
            submenu: menu
        })
    }

    return <Images onChoose={handleChoose} onLoad={handleLoad} />
}