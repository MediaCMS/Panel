import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const host = 'https://www.youtube.com/embed/'
const regex = /^https:\/\/www\.youtube\.com\/watch\?(.*&)?v=([^&]*)(&.*)?$/
const api = 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='

export default props => {

    const context = useOutletContext()

    const handleChange = async event => {
        const matches = event.target.value.match(regex)
        if (!matches) {
            return context.setAlert('Невідомий формат адреси')
        }
        const id = matches[2]
        props.onChange('url', id)
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
        ? <iframe src={host + props.url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen title="YouTube video player"
            data-size={props.size} data-ratio={props.ratio}
            className="video">
        </iframe>
        : <Form.Control title="Посилання на відео" onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=3JJyKWPKIcQ" />
}