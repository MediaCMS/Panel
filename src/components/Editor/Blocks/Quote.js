import React, { useEffect } from 'react'
import Field from '../Field.js'

export default props => {

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

    return <blockquote data-size={props?.size}>
        <Field as="p" name="text" value={props.text}
            title="Текст цитати" onChange={props.onChange} />
        <footer>
            <Field as="span" name="link" value={props.link}
                title="Посилання на джерело цитати" onChange={props.onChange} />
            <Field as="span" name="name" value={props.name}
                title="Автор цитати" onChange={props.onChange} />
            <Field as="span" name="work" value={props.work}
                title="Назва публікації" onChange={props.onChange} />
        </footer>
    </blockquote>
}