import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Autocomplete from '../../Form/Field/Autocomplete/Single.js'
import DateTime from '../../Form/Field/DateTime.js'
import Show from '../../Form/Field/Image/Show.js'
import Choose from '../../Form/Field/Image/Choose.js'
import Field from '../Field.js'
import config from '../../../config.js'

export default props => {

    const [categories, setCategories] = useState([])
    const [extended] = useState(!!props?.user)
    const context = useOutletContext()

    useEffect(() => {
        props.menu.dispatch(
            props.menu.actions.remove(['move', 'remove'])
        )
    }, [])

    useEffect(async () => {
        const categories = await context.api.panel.get('/categories')
        setCategories(categories)
    }, [])

    return (
        <div className={'main' + (props?.image ? ' image' : '')}
            style={{ backgroundImage: props?.image
                ? `url(${config.images.url + '/' + props.image})` : ''}}>
            <div className="text">
                {extended && 
                    <div className="category">
                        <Form.Select value={props.category} title="Категорія"
                            onChange={
                                event => props.onChange('category', event.target.value)
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
                        event => props.onChange('title', event.target.textContent)
                    }
                    onPaste={props.onPaste}>
                    {props.title}
                </h1>
                {extended &&
                    <Autocomplete name="user" value={props.category} label=""
                        title="Автор" path="/users" className="user" required />
                }
                {extended &&
                    <DateTime className="date" label="" />
                }
            </div>
            <div className="image text-center position-absolute mx-auto">
                {props?.image
                    ? <Show as="menu" name={props.image} className="imageMenu"
                        onChange={() => props.onChange('image')}
                        label="Видалити зображення" />
                    : <Choose library={true}
                        onChange={value => props.onChange('image', value)} />
                }
            </div>
            <div className="copyright">
                <Field name="source" value={props.source}
                    title="Джерело зображення" onChange={props.onChange} />
                <Field name="author" value={props.author}
                    title="Автор зображення" onChange={props.onChange} />
            </div>
        </div>
    )
}