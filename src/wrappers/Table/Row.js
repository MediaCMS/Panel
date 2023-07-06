import React from 'react'

export default function (props) {

    return (
        <tr onClick={props?.onClick} title={props?.title} className={
            (typeof props.status !== 'undefined') && (props.status === false) ? 'text-muted' : ''
        }>
            {props.children}
        </tr>
    )
}