import React from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Images from '../../blocks/Images.js'

export default function () {

    const context = useOutletContext()
    const navigate = useNavigate()

    const handleChoose = image => {
        navigate('/images/editor/' + image._id)
    }

    const handleLoad = init => {
        init.submenu[0].path = '/images/editor'
        context.init(init)
    }

    return <Images onChoose={handleChoose} onLoad={handleLoad} />
}