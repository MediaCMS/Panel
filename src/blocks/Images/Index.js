import React from 'react'
import Images, { Image } from '../../components/Images.js'

export default function (props) {

    return (
        <Images>
            {props.images.map(image => (
                <Image {...image} key={image._id}
                    onClick={() => props.onClick(image._id)} />
            ))}
        </Images>
    )
}