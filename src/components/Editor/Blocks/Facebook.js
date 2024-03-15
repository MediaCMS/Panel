import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const sourceTemplate = 'https://www.facebook.com/plugins/post.php'
    + '?href=$url&show_text=$showText&width=$width'
const regex = new RegExp(
    '^.*https:\/\/www\\.facebook\\.com\/plugins\/post\\.php'
    + '\\?href=([^&]+)&show_text=(true|false).*'
    + 'width="([^"]+)".*height="([^"]+)".*$'
)
const placeholder = '<iframe src="https://www.facebook.com/plugins/post.php?href='
    + 'https%3A%2F%2Fwww.facebook.com%2FNationalBankOfUkraine%2Fposts%2F'
    + 'pfbid02exnBbnN9mN4tirgfvsVfEvjcpqLQMp2VYBo21eXgW2H3cQ63qhWph3emsPokPHHXl'
    + '&show_text=true&width=500" width="500" height="653" scrolling="no" '
    + 'style="border:none;overflow:hidden" frameborder="0" allowfullscreen="true"'
    + 'allow="autoplay;clipboard-write;encrypted-media;picture-in-picture;web-share"'
    + '></iframe>'

export default props => {

    const [source, setSource] = useState()
    const context = useOutletContext()

    const handleChange = async event => {
        console.log(event.target.value)
        console.log(regex.toString())
        const matches = event.target.value.match(regex)
        console.log(matches)
        if (!matches) {
            return context.setAlert(
                'Невідомий формат HTML-коду вставлення'
            )
        }
        props.onChange({
            url: decodeURIComponent(matches[1]),
            showText: matches[2] === 'true',
            width: parseInt(matches[3]),
            height: parseInt(matches[4])
        })
    }

    useEffect( () => {
        if (!props?.url) return
        console.log(props)
        const source = sourceTemplate
        .replace('$url', encodeURIComponent(props.url))
        .replace('$showText', props.showText)
        .replace('$width', props.width)
        console.log(source)
        setSource(source)
    }, [props.url, props.textShow, props.width])

    return source 
        ? <iframe src={source} className="facebook"
            width={props?.width} height={props?.height} allowFullScreen={true}
            allow="autoplay;clipboard-write;encrypted-media;picture-in-picture;web-share">
        </iframe>
        : <Form.Control as="textarea" title="HTML-код вкладення"
            onChange={handleChange} placeholder={placeholder} />
}