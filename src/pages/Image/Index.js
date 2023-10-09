import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Moment from 'moment'
import Images from './Index/Images.js'
import Filter from './Index/Filter.js'

export default function () {

    const [images, setImages] = useState([])
    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-10, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        status: true,
        _sort: { field: 'date', order: -1 }
    })
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
        <Images list={images} onClick={handleClick} />
        {filter &&
            <Filter data={params} onChange={setParams}
                show={filter} onChangeShow={setFilter}
                onSubmit={handleLoad} />
        }
    </>
}