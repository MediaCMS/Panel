import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const Map = ({ url, size, menu, onChange }) => {

    const context = useOutletContext()

    const handleChange = async event => {
        const marches = event.target.value.match(/src="([^"]+)"/)
        if (!marches) {
            return context.setAlert(
                'Невідомий формат HTML-коду вкладення'
            )
        }
        onChange('url', marches[1])
    }

    useEffect( () => {
        menu.dispatch(
            menu.actions.insert(
                'resize', menu.resize
            )
        )
        size && onChange('size', 'large')
    }, [])

    return url 
        ? <iframe src={url} data-size={size} className="map"
            title="Google Map" allowFullScreen={true} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
        </iframe>
        : <Form.Control as="textarea" title="HTML-код вкладення"
            onChange={handleChange} autoFocus placeholder={
                '<iframe src="https://www.google.com/maps/embed?pb='
                + '!1m18!1m12!1m3!1d2573.03837451807!2d24.029116576498076!3d49'
                + '.84173647148247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13'
                + '.1!3m3!1m2!1s0x473add6daf2238f7%3A0x657ac2a6cdcf320b'
                + '!2z0KDQsNGC0YPRiNCwLCDQv9C70L7RidCwINCg0LjQvdC'
                + '-0LosIDEsINCb0YzQstGW0LIsINCb0YzQstGW0LLRgdGM0Lr'
                + 'QsCDQvtCx0LvQsNGB0YLRjCwgNzkwMDA!5e0!3m2!1suk'
                + '!2sua!4v1710179264348!5m2!1suk!2sua"'
                + ' width="800" height="600" style="border:0;"'
                + ' allowfullscreen="" loading="lazy"'
                + ' referrerpolicy="no-referrer-when-downgrade">'
                + '</iframe>'
            }
        />
}

Map.propTypes = {
    url: PropTypes.string,
    size: PropTypes.string,
    menu: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default Map