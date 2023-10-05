import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Images from './Index/Images.js'
import Filter from './Index/Filter.js'

export default function () {

    const [images, setImages] = useState([])
    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({ status: true })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate('/images/editor/' + id)
    }

    const handleLoad = async () => {
        const images = await context.api.panel.get('/images', { params })
        setImages(images)
    }

    useEffect(() => {
        context.init({
            title: 'Зображення / Список',
            submenu: [
                { title: 'Створити', path: '/images/editor' },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Images data={images} onClick={handleClick} />
        {filter &&
            <Filter data={params} onChange={setParams}
                show={filter} onChangeShow={setFilter}
                onSubmit={handleLoad} />
        }
    </>
}