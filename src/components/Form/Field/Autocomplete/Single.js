import PropTypes from 'prop-types'
import React, { useState, useEffect, useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Context from '../../../../contexts/Form.js'

const Single = props => {

    const [prompt, setPrompt] = useState('')
    const [items, setItems] = useState([])
    const [title, setTitle] = useState()
    const [value, setValue] = useState(props?.value)
    const context = useOutletContext()
    const data = useContext(Context)

    const handleFocus = async event => {
        event.target.select()
    }

    const handleChange = async event => {
        setPrompt(event.target.value)
        if (event.target.value.length < 1) {
            setItems([])
            return
        }
        const params = {
            title: event.target.value,
            status: true,
            _compact: true
        }
        if (value) params._exclude = value
        const items = await context.api.panel
            .get(props.path, { params })
        setItems(items)
    }

    const handleClick = event => {
        data.set(props.name, event.target.id)
        setTitle(event.target.innerHTML)
        setItems([])
    }

    const handleBlur = event => {
        if (event.target.value === title) return
        if (event.target.value.length) {
            setPrompt(title)
        } else {
            data.set(props.name, null)
            setPrompt('')
            setTitle('')
        }
        setItems([])
    }

    useEffect(() => {
        (async () => {
            const valueNew = value ?? data.get(props.name)
            if (!valueNew) return
            const item = await context.api.panel
                .get(props.path + '/' + valueNew)
            setTitle(item.title)
            setValue(valueNew)
        })()
    }, [])

    useEffect(() => {
        if (!title) return
        setPrompt(title)
    }, [title])

    return (
        <Form.Group className={
            'autocomplete single dropdown ' + (props.className ?? '')
        }>
            {props?.label && <Form.Label className="d-block">
                {props.label ?? 'Автозаповнення'}
            </Form.Label>}
            <Form.Control type="text" name="prompt" value={prompt}
                pattern={props.pattern ?? '.{1,128}'} onChange={handleChange}
                onFocus={handleFocus} onBlur={handleBlur} autoComplete="off"
                title={props.title ?? 'Введіть символи для пошуку'}
                required={!!props?.required} disabled={!!props?.disabled} />
            {!!items.length && (
                <ul className="dropdown-menu show">
                    {items.map(item => (
                        <li className="dropdown-item" onMouseDown={handleClick}
                            id={item._id} key={item._id}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            )}
        </Form.Group>
    )
}

Single.propTypes = {
    value: PropTypes.any,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    pattern: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string
}

export default Single