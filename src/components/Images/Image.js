import React from 'react'
import config from '../../config.js'

export default function (props) {

    //const path = props.path.replace(/\/\d+x\d+\.(\w+)$/, '/320.$1')
    const title = props.title + ' (' +  props?.tags.join() + ')'

    return (  
        <div className="image border border-white bg-secondary d-inline-block"
            onClick={props.onClick}>
            <img src={config.images.url + '/' + props.slug + '?width=320'}
                className={props.status ? '' : 'image-muted'}
                title={title} alt={props.title} />
        </div>
    )
}