import React from 'react'

export default function (props) {
    return (
        <tr onClick={props?.onClick} title={props?.title} className={
            ('status' in props) && (props.status === false) ? 'text-muted' : null
        }>
            {props.children}
        </tr>
    )
}