import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const Video = ({ url, size, ratio, menu, onChange }) => {

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
        onChange(data)
    }

    useEffect(() => {
        menu.dispatch(
            menu.actions.insert(
                'resize', menu.resize
            )
        )
        if (!size) {
            onChange('size', 'small')
        }
    }, [])

    return url 
        ? <iframe src={url} data-size={size} data-ratio={ratio}
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowFullScreen title="YouTube video player" className="video">
        </iframe>
        : <Form.Control as="textarea" title="HTML-код вкладення"
            onChange={handleChange} placeholder={
                '<iframe width="560" height="315"'
                + ' src="https://www.youtube.com/embed/k7dy1B6bOeM?si=cpvSkAV6EJYu40dh'
                + ' title="YouTube video player" frameborder="0" allowfullscreen'
                + ' allow="accelerometer;autoplay;clipboard-write;encrypted-media;'
                + ' gyroscope;picture-in-picture;web-share"></iframe>'
            } autoFocus
        />
}

Video.propTypes = {
    url: PropTypes.string,
    size: PropTypes.string,
    ratio: PropTypes.string,
    menu: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default Video