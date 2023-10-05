import React from 'react'
import Images, { Image } from '../../../components/Images.js'

export default function (props) {

    return (
        <Images>
            {props.data.map(image => (
                <Image title={image.title} path={image.path} status={image.status}
                    onClick={() => props.onClick(image._id)}
                    id={image._id} key={image._id} />
            ))}
        </Images>
    )
}