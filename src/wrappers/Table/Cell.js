import React from 'react'

export default function (props) {

    return props?.scope ? (  
        <th scope={props?.scope} className="text-center">{props.children}</th>
    ) : (
        <td className={'text-' + (props?.align ?? 'center')}>{props.children}</td>
    )
}