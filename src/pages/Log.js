import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Moment from 'moment'
import Table, { Row, Cell } from '../components/Table.js'
import Filter from './Log/Filter.js'

const Log = () => {

    const [logs, setLogs] = useState([])
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-1, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        _sort: { field: 'date', order: -1 }, _skip: 0, _limit: 50
    })
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const load = async params => {
        setParams(params)
        return await context.api.panel.get('/logs', { params })
     }

    const handleLoad = async () => 
        setLogs(
            await load({ ...params, _skip: 0 })
        )

    const handleAppend = async skip => {
        const logsNew = await load({ ...params, _skip: skip })
        setLogs([...logs, ...logsNew])
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
        <Table columns={['Дата', 'Контроллер', 'Дія', 'Користувач', 'Документ']}
            params={params} onAppend={handleAppend}>
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

export default Log