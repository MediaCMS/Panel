import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Moment from 'moment'
import Table, { Row, Cell } from '../components/Table.js'
import Filter from './Log/Filter.js'

export default () => {

    const [logs, setLogs] = useState([])
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-1, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        _sort: { field: 'date', order: -1 }
    })
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setLogs(
            await context.api.panel.get('/logs', { params })
        )
    }

    useEffect(() => {
        context.init({
            title: 'Логи',
            submenu: [{
                title: 'Фільтр',
                onClick: () => setFilter(true)
            }]
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Дата', 'Контроллер', 'Дія', 'Користувач', 'Документ']}>
            {logs.map(log => (
                <Row key={log._id}>
                    <Cell className="text-center">{
                        Moment(log.date).format('YYYY-MM-DD HH:mm:ss')
                    }</Cell>
                    <Cell className="text-center">{log.controller}</Cell>
                    <Cell className="text-center">{log.action}</Cell>
                    <Cell className="text-center">{log.user}</Cell>
                    <Cell className="text-center">{log.document}</Cell>
                </Row>
            ))}
        </Table>
        {filter && <Filter data={params}
            onChange={setParams} onSubmit={handleLoad}
            show={filter} onHide={() => setFilter(false)} />}
    </>
}