import React from 'react'

export default function (props) {
    return (
        <tr onClick={props?.onClick} title={props?.title} className={
            (props.status === undefined) || (props.status === false) ? 'text-muted' : null
        }>
            {props.children}
        </tr>
    )
}