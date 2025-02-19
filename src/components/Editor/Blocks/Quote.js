import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Field from '../Field.js'

const Quote = ({
    text, name, work, link, size, menu, onChange, onPaste
}) => {

    useEffect( () => {
        menu.dispatch(
            menu.actions.insert(
                'resize', menu.resize
            )
        )
        if (!size) {
            onChange('size', 'large')
        }
    }, [])

    return <blockquote data-size={size} onPaste={onPaste}>
        <Field as="p" name="text" value={text} autoFocus
            title="Текст цитати" onChange={onChange} />
        <footer>
            <Field as="span" name="link" value={link}
                title="Посилання на джерело цитати" onChange={onChange} />
            <Field as="span" name="name" value={name}
                title="Автор цитати" onChange={onChange} />
            <Field as="span" name="work" value={work}
                title="Назва публікації" onChange={onChange} />
        </footer>
    </blockquote>
}

Quote.propTypes = {
    text: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    work: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    size: PropTypes.string,
    menu: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        actions: PropTypes.shape({
            insert: PropTypes.func.isRequired,
        }).isRequired,
        resize: PropTypes.string.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired
}

export default Quote