import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

export default props => {

    const context = useOutletContext()

    const handleChange = async event => {
        const matches = event.target.value.match(
            /src="([^"]+)".*width="([^"]+)".*height="([^"]+)"/
        )
        if (!matches) {
            return context.setAlert(
                'Невідомий формат HTML-коду вкладення'
            )
        }
        const data = {
            url: matches[1],
            width: parseInt(matches[2]),
            height: parseInt(matches[3])
        }
        props.onChange(data)
    }

    return props?.url 
        ? <iframe src={props.url} className="facebook"
            width={props?.width} height={props?.height} allowFullScreen={true}
            allow="autoplay;clipboard-write;encrypted-media;picture-in-picture;web-share">
        </iframe>
        : <Form.Control as="textarea" title="HTML-код вкладення"
            onChange={handleChange} autoFocus placeholder={
                '<iframe src="https://www.facebook.com/plugins/post.php?href='
                + 'https%3A%2F%2Fwww.facebook.com%2Funiversemagazinecom%2Fposts%2F'
                + 'pfbid02o95aZCpTWn8LeD2rsbkBxcV19N7t3coBobawrpYJD6AXC5rcPQb1RMFBPRm71efzl'
                + '&show_text=true&width=500" width="500" height="653" scrolling="no"'
                + ' style="border:none;overflow:hidden" frameborder="0" allowfullscreen="true"'
                + ' allow="autoplay;clipboard-write;encrypted-media;picture-in-picture;web-share"'
                + '></iframe>'
            }
        />
}