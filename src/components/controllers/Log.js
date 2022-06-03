"use strict"

import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

export function Index() {

    const [logs, setLogs] = useState({ items: [] })
    const context = useOutletContext()

    useEffect(async () => {
        context.setParams({
            title: 'Логи (cписок)',
            router: ['log', 'index']
        })
        /*
        setLogs({ items:
            await context.api.get('/логи')
        })
        */
    }, [])

    return (
        <table className="table table-hover">
            <thead>
                <tr className="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Тип</th>
                    <th scope="col">Опис</th>
                </tr>
            </thead>
            <tbody>
                {logs.items.map((log, index) => (
                    <tr key={log._id} title={log.description}>
                        <th scope="row">{index + 1}</th>
                        <td>{log.title}</td>
                        <td>{log.type}</td>
                        <td>{log.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default { Index }