import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const Twitter = ({ url, text, author, date, onChange }) => {

    const ref = useRef()
    const context = useOutletContext()

    const handleChange = async event => {
        const data = {}
        const value = event.target.value.replace(/\s\s+/gm, ' ')
        const url = value.match(
            /(https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+)\??/
        )
        if (!url) {
            return context.setAlert('Неможу визначити посилання')
        }
        data.url = url[1]
        const text = value.match(/<p[^>]*>(.*)<\/p>/)
        if (text) {
            data.text = text[1].trim()
        } else {
            context.setAlert('Неможу визначити текст')
        }
        const author = value.match(/&mdash; (.*) \(@([^)]+)\)/)
        if (author) {
            data.author = { name: author[1], login: author[2] }
        } else {
            context.setAlert('Неможу визначити автора')
        }
        const date = value.match(/<p.*>.*<\/p>.*<a.*>(.*)<\/a>/)
        if (date) {
            data.date =  new Date(date[1]).toISOString().slice(0, 10)
        } else {
            context.setAlert('Неможу визначити дату')
        }
        onChange(data)
    }

    useEffect(() => {
        if (!ref?.current) return
        // eslint-disable-next-line no-undef
        twttr.widgets.load(ref.current)
    }, [ref.current])

    return url
        ? <blockquote className="twitter-tweet" ref={ref}>
            <p lang="en" dir="ltr"
                dangerouslySetInnerHTML={{ __html: text ?? 'Текст твіта' }}>
            </p>
            <footer>
                &mdash; {author?.name} <cite>(@{author?.login})</cite>&nbsp;
                <a href={url}>{date}</a>
            </footer>
        </blockquote>
        : <Form.Control as="textarea" title="HTML-код вкладення"
            onChange={handleChange} placeholder={
                '<blockquote class="twitter-tweet">'
                + '<p lang="en" dir="ltr">'
                + 'And while Crew-8 was readying for launch and Crew-7 was aboard the orbiting laboratory,'
                +' Crew-9 was preparing for their mission at SpaceX'
                + '<a href="https://t.co/scr0RM0DlP">pic.twitter.com/scr0RM0DlP</a>'
                + '</p>&mdash; SpaceX (@SpaceX)'
                + '<a href="https://twitter.com/SpaceX/status/1767205077566058934?ref_src=twsrc%5Etfw">March 11, 2024</a>'
                + '</blockquote>'
                + '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
            } autoFocus
        />
}

Twitter.propTypes = {
    url: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.shape({
        name: PropTypes.string,
        login: PropTypes.string
    }),
    date: PropTypes.string,
    onChange: PropTypes.func.isRequired
}

export default Twitter