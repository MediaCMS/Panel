import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const host = 'https://www.google.com/maps/embed?pb='
const regex = /^.*src="https:\/\/www\.google\.com\/maps\/embed\?pb=([^"]*).*$/
const placeholder = '<iframe src="https://www.google.com/maps/embed?pb='
    + '!1m18!1m12!1m3!1d2573.03837451807!2d24.029116576498076!3d49'
    + '.84173647148247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13'
    + '.1!3m3!1m2!1s0x473add6daf2238f7%3A0x657ac2a6cdcf320b'
    + '!2z0KDQsNGC0YPRiNCwLCDQv9C70L7RidCwINCg0LjQvdC'
    + '-0LosIDEsINCb0YzQstGW0LIsINCb0YzQstGW0LLRgdGM0Lr'
    + 'QsCDQvtCx0LvQsNGB0YLRjCwgNzkwMDA!5e0!3m2!1suk'
    + '!2sua!4v1710179264348!5m2!1suk!2sua"'
    + ' width="800" height="600" style="border:0;"'
    + ' allowfullscreen="" loading="lazy"'
    + 'referrerpolicy="no-referrer-when-downgrade">'
    + '</iframe>'

export default props => {

    const context = useOutletContext()

    const handleChange = async event => {
        const url = event.target.value.match(regex)
        if (!url) {
            return context.setAlert('Невідомий формат HTML-коду вставлення')
        }
        props.onChange('url', url[1])
    }

    useEffect( () => {
        props.menu.dispatch(
            props.menu.actions.insert(
                'resize', props.menu.resize
            )
        )
        if (!props?.size) {
            props.onChange('size', 'large')
        }
    }, [])

    return props?.url 
        ? <iframe src={host + props.url} data-size={props.size} className="map"
            title="Google Map" allowFullScreen={true} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
        </iframe>
        : <Form.Control as="textarea" title="HTML-код вкладення мапи Google Map в сайт"
            onChange={handleChange} placeholder={placeholder} />
}