import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

export default props => {

    const context = useOutletContext()

    const handleChange = async event => {
        const matches = event.target.value.match(
            /width="([^"]+)".*height="([^"]+)".*src="([^"]+)"/
        )
        if (!matches) {
            return context.setAlert(
                'Невідомий формат HTML-коду вкладення'
            )
        }
        const ratio = Math.round(
            (parseInt(matches[1]) / parseInt(matches[2])) * 100
        ) / 100
        const data = { url: matches[3], ratio: ratio }
        props.onChange(data)
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
        ? <iframe src={props.url} data-size={props.size} data-ratio={props.ratio}
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowFullScreen title="YouTube video player" className="video">
        </iframe>
        : <Form.Control as="textarea" title="HTML-код вкладення" onChange={handleChange}
            placeholder={
                '<iframe width="560" height="315"'
                + ' src="https://www.youtube.com/embed/k7dy1B6bOeM?si=cpvSkAV6EJYu40dh'
                + ' title="YouTube video player" frameborder="0" allowfullscreen'
                + ' allow="accelerometer;autoplay;clipboard-write;encrypted-media;'
                + ' gyroscope;picture-in-picture;web-share"></iframe>'
            }
        />
}