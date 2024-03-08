import React, { useEffect } from 'react'
import Field from '../Field.js'

const api = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='

export default props => {

    const handleChange = async (key, value) => {
        const id = value.match(/^https:\/\/www\.youtube\.com\/watch\?v=(.*)$/)[1]
        props.onChange(key, id)
        const response = await fetch(api + id)
        const data = await response.json()
        const ratio = Math.round((data.width / data.height) * 100) / 100
        props.onChange('ratio', ratio)
    }

    useEffect( () => {
        props.menu.dispatch(
            props.menu.actions.insert(
                'resize', props.menu.resize
            )
        )
        if (!props?.size) {
            props.onChange('size', 'small')
        }
    }, [])

    return props?.url 
        ? <iframe src={'https://www.youtube.com/embed/' + props.url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen title="YouTube video player"
            data-size={props.size} data-ratio={props.ratio}
            className="video">
        </iframe>
        : <Field as="div" name="url" value={props.url}
            title="Посилання на відео" onChange={handleChange} />
}