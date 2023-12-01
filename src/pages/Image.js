import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Images from '../blocks/Images.js'

export default function () {

    const [upload, setUpload] = useState(false)
    const context = useOutletContext()

    useEffect(() => {
        context.init({
            title: 'Зображення',
            submenu: [
                { title: 'Завантажити', onClick: () => setUpload(true) },
            ], 
            width: 'small'
        })
    }, [])

    return <Images upload={upload} setUpload={setUpload} />
}