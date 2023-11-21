import React from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Galleries from '../../blocks/Galleries.js'

export default function () {

    const context = useOutletContext()
    const navigate = useNavigate()

    const handleChoose = gallery => {
        navigate('/galleries/editor/' + gallery._id)
    }

    const handleLoad = menu => {
        menu[0].path = '/galleries/editor'
        context.init({
            title: 'Галереї / Список',
            submenu: menu
        })
    }

    return <Galleries onChoose={handleChoose} onLoad={handleLoad} />
}