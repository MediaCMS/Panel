import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const host = 'https://platform.twitter.com/embed/Tweet.html'
const url = '?dnt=false&embedId=twitter-widget-0&frame=false'
    + '&hideCard=false&hideThread=false&id=0123456789'
    + '&lang=en&origin=https%3A%2F%2Fpublish.twitter.com%2F%23'
    + '&sessionId=b25822f74af35addadf583c4f8205ac3bae9cece'
    + '&theme=light&widgetsVersion=2615f7e52b7e0%3A1702314776716'
const regex = /^https:\/\/(x|twitter)\.com\/[^\/]+\/status\/(\d+)(\/)?(\?.*)?$/

export default props => {

    const context = useOutletContext()

    const handleChange = async event => {
        const matches = event.target.value.match(regex)
        if (!matches) {
            return context.setAlert('Невідомий формат HTML-коду вставлення')
        }
        props.onChange('url', matches[2])
    }

    return props?.url 
        ? <iframe src={host + url.replace('0123456789', props.url)}
            allowtransparency="true" allowFullScreen={true}
            className="twitter" >
        </iframe>
        : <Form.Control title="Посилання на твіт" onChange={handleChange}
            placeholder="https://x.com/SpaceX/status/1767205077566058934" />
}