import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Autocomplete from '../../Form/Field/Autocomplete/Single.js'
import DateTime from '../../Form/Field/DateTime.js'
import Show from '../../Form/Field/Image/Show.js'
import Choose from '../../Form/Field/Image/Choose.js'
import Field from '../Field.js'
import config from '../../../config.js'

const Main = ({
    title, category, image, user, menu, onChange, onPaste
}) => {

    const ref = useRef()
    const [categories, setCategories] = useState([])
    const [extended] = useState(!!user)
    const context = useOutletContext()

    useEffect(() => {
        menu.dispatch(
            menu.actions.remove(['move', 'remove'])
        )
    }, [])

    useEffect(() => {
        (async () => {
            const categories = await context.api.panel.get('/categories')
            setCategories(categories)
        })()
    }, [])

    useEffect(() => ref.current.focus(), [ref.current])

    return <div className={'main' + (image ? ' image' : '')}
        style={{ backgroundImage: image?.url
            ? `url(${config.images.url + '/' + image.url})` : ''}}>
        <div className="text">
            {extended && 
                <div className="category">
                    <Form.Select value={category} title="Категорія"
                        onChange={
                            event => onChange('category', event.target.value)
                        }>
                        {categories.map(category => (
                            <option value={category._id} key={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            }
            <h1 contentEditable="true" suppressContentEditableWarning="true"
                onBlur={
                    event => onChange('title', event.target.textContent)
                }
                onPaste={onPaste} ref={ref} className="editable">
                {title}
            </h1>
            {extended &&
                <Autocomplete name="user" value={user} label=""
                    title="Автор" path="/users" className="user" required />
            }
            {extended &&
                <DateTime className="date" label="" />
            }
        </div>
        <div className="image">
            <Field name="image.source" value={image?.source}
                title="Джерело зображення" className="source"
                onChange={onChange} />
            <div className="buttons">
                {image?.url
                    ? <Show as="menu" name={image.url} className="menu"
                        onChange={() => onChange('image.url')}
                        label="Видалити зображення" />
                    : <Choose library={true}
                        onChange={value => onChange('image.url', value)} />
                }
            </div>
            <Field name="image.author" value={image?.author}
                title="Автор зображення" className="author"
                onChange={onChange} />
        </div>
    </div>
}

Main.propTypes = {
    title: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.object,
    user: PropTypes.any,
    menu: PropTypes.object,
    onChange: PropTypes.func,
    onPaste: PropTypes.func,
}

export default Main