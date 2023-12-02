import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Moment from 'moment'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-1, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        _sort: { field: 'date', order: -1 }
    })
    const [logs, setLogs] = useState([])
    const context = useOutletContext()

    const handleLoad = async () => {
        setLogs(
            await context.api.panel.get('/logs', { params })
        )
    }

    useEffect(() => {
        context.init({
            title: 'Логи / Список',
            submenu: [
                { title: 'Фільтр', onClick: () => setFilter(true) }
            ]
        })
    }, [])

    useEffect(async () => handleLoad(), [])

    return <>
        <Table logs={logs} />
        <Filter data={params} onChange={setParams} onSubmit={handleLoad}
            show={filter} onHide={() => setFilter(false)} />
    </>
}