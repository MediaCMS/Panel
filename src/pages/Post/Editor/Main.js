import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Context from '../../../contexts/Form.js'
import Autocomplete from '../../../components/Form/Field/Autocomplete/Single.js'
import DateTime from '../../../components/Form/Field/DateTime.js'
import Show from '../../../components/Form/Field/Image/Show.js'
import Choose from '../../../components/Form/Field/Image/Choose.js'
import Field from '../../../components/Editor/Field.js'
import config from '../../../config.js'

export default props => {

    const [categories, setCategories] = useState([])
    const [background, setBackground] = useState([])
    const ref = { main: useRef(), title: useRef() }
    const context = useOutletContext()
    const data = useContext(Context)

    useEffect(async () => {
        const categories = await context.api.panel.get('/categories')
        setCategories(categories)
    }, [])

    useEffect(
        () => ref.title.current.focus(),
        [ref.title.current]
    )

    useEffect(() => {
        const background = !data.get('image.url') ? '' :
            `url(${config.images.url + data.get('image.url')}` +
            `?width=${ref.main.current.offsetWidth}` +
            `&height=${ref.main.current.offsetHeight})`
        setBackground(background)
    }, [data.get('image.url'), ref.main.current])

    return <div className="block block-type-main">
            <div className={'main' + (data.get('image.url') ? ' image' : '')}
            style={{ backgroundImage: background }} ref={ref.main}>
            <div className="layout">
                <div className="head">
                    <div className="category">
                        <Form.Select value={data.get('category')} title="Категорія"
                            onChange={
                                event => data.set('category', event.target.value)
                            }>
                            {categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.title}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>
                <div className="body">
                    <h1 contentEditable="true" suppressContentEditableWarning="true"
                        onBlur={
                            event => data.set('title', event.target.textContent)
                        }
                        onPaste={props.onPaste} ref={ref.title} className="editable">
                        {data.get('title')}
                    </h1>
                    <Autocomplete name="user" value={data.get('user')} label=""
                        title="Автор" path="/users" className="user"
                        placeholder="Автор" required />
                </div>
                <div className="foot">
                    <DateTime className="date" label="" />
                </div>
            </div>
            <div className="bottom">
                <Field name="image.source" value={data.get('image.source')}
                    title="Джерело зображення" className="source flex-grow-1 text-start w-25"
                    onChange={(name, value) => data.set(name, value)} />
                <div className="buttons flex-grow-0">
                    {data.get('image.url')
                        ? <Show as="menu" name={data.get('image.url')} className="menu"
                            onChange={() => data.set('image.url')}
                            label="Видалити зображення" />
                        : <Choose library={true}
                            onChange={value => data.set('image.url', value)} />
                    }
                </div>
                <Field name="image.description" value={data.get('image.description')}
                    title="Опис зображення" className="description flex-grow-1 text-end w-25"
                    onChange={(name, value) => data.set(name, value)} />
            </div>
        </div>
    </div>
}