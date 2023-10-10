import React from 'react'

export default function (props) {

    const className = []

    if (props?.className) {
        className.push(props?.className)
    }

    if (('status' in props) && (props.status === false)) {
        className.push('text-muted')
    }

    return (
        <tr onClick={props?.onClick} title={props?.title} className={className}>
            {props.children}
        </tr>
    )
}