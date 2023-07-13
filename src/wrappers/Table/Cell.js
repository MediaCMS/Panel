import React from 'react'

export default function (props) {

    return props?.scope ? (  
        <th className="text-center" {...props}>{props.children}</th>
    ) : (
        <td className="text-center" {...props}>{props.children}</td>
    )
}