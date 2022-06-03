"use strict"

import React from "react"

export default function (props) {

    return (
        <table className={'table table-hover mx-auto ' + props.className}>
            <thead>
                <tr className="text-center">
                    <th scope="col">#</th>
                    {props.columns.map((column, index) => (
                        <th scope="col" key={index}>{column?.title ?? column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.rows.map((row, index) => (
                    <tr key={row.id} role="button" onClick={() => props.onClick(row.id)}
                        className={(row?.status !== null) ? (!row.status ? 'text-muted' : '') : null}>
                        <th scope="row" className="text-center">{index + 1}</th>
                        {row.values.map((value, index) => (
                            <td className={props.columns[index]?.class} key={index}>{value}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}