import React, { useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

export default props => {

    const ref = useRef()
    const context = useOutletContext()

    const handleChange = async event => {
        const data = {}
        const value = event.target.value.replace(/\s\s+/gm, ' ')
        const url = value.match(
            /(https:\/\/(x|twitter)\.com\/[^\/]+\/status\/\d+)\??/
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
        if (author) {
            data.date =  new Date(date[1]).toISOString().slice(0, 10)
        } else {
            context.setAlert('Неможу визначити дату')
        }
        props.onChange(data)
    }

    useEffect(() => {
        if (!ref?.current) return
        twttr.widgets.load(ref.current)
    }, [ref.current])


    return props?.url
        ? <blockquote className="twitter-tweet" ref={ref}>
            <p lang="en" dir="ltr"
                dangerouslySetInnerHTML={{ __html: props.text ?? 'Текст твіта' }}>
            </p>
            <footer>
                &mdash; {props?.author?.name} <cite>(@{props?.author?.login})</cite>&nbsp;
                <a href={props.url}>{props?.date}</a>
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
            }
        />
}