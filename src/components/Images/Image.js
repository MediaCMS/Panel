import React from 'react'
import config from '../../config.js'

export default function (props) {

    const path = props.path.replace(/\/\d+x\d+\.(\w+)$/, '/320.$1')

    return (  
        <div className="image border border-white bg-secondary d-inline-block" key={props.id}>
            <img src={config.images.url + path} title={props.title}
                className={props.status ? '' : 'image-muted'} alt={props.title} />
        </div>
    )
}