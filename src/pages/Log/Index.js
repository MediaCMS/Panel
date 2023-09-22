import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table from './Index/Table.js'
import Filter from './Index/Filter.js'

export default function () {

    const [filter, setFilter] = useState(false)
    const [params, setParams] = useState({
        _sort: { field: 'date', order: -1 }
    })
    const [logs, setLogs] = useState([])
    const context = useOutletContext()

    const handleLoad = async () => {
        const logs = await context.api.panel.get('/logs', { params })
        setLogs(logs)
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
        {filter &&
            <Filter data={params} onChange={setParams}
                show={filter} onChangeShow={setFilter}
                onSubmit={handleLoad} />
        }
    </>
}