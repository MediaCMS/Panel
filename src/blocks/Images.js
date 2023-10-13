import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Moment from 'moment'
import Index from './Images/Index.js'
//import Filter from './Images/Filter.js'

export default function (props) {

    const [images, setImages] = useState([])
    const [filter, setFilter] = useState(false)
    const [upload, setUpload] = useState(false)
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-10, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        status: true,
        _sort: { field: 'date', order: -1 }
    })
    const context = useOutletContext()

    const handleChoose = id => {
    }

    const handleLoad = async () => {
        const images = await context.api.panel.get('/images', { params })
        setImages(images)
    }

    useEffect(() => {
        props.onLoad({
            title: 'Зображення / Список',
            submenu: [
                { title: 'Завантажити', onClick: () => setUpload(true) },
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Index images={images} onChoose={props.onChoose} />
        {/* 
        {filter &&
            <Filter data={params} onChange={setParams}
                show={filter} onChangeShow={setFilter}
                onSubmit={handleLoad} />
        }
        */}
    </>
}