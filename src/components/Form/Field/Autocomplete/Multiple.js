import PropTypes from 'prop-types'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Context from '../../../../contexts/Form.js'

const Multiple = props => {

    const [prompt, setPrompt] = useState('')
    const [items, setItems] = useState([])
    const [value, setValue] = useState([])
    const [list, setList] = useState([])
    const context = useOutletContext()
    const data = useContext(Context)
    const ref = useRef()

    const handleChange = async event => {
        setPrompt(event.target.value)
        if (event.target.value.length < 1) {
            setList([])
            return
        }
        const params = {
            title: event.target.value,
            status: true,
            _compact: true
        }
        if (value.length) {
            params._exclude = value.join()
        }
        const listNew = await context.api.panel
            .get(props.path, { params })
        setList(listNew)
    }

    const handleClick = event => {
        const valueNew = [...value, event.target.id]
        data.set(props.name, valueNew)
        const itemsNew = [ ...items, {
            _id: event.target.id, title: event.target.title
        }]
        setItems(itemsNew)
        const listNew = list.filter(item =>
            item._id !== event.target.id
        )
        setList(listNew)
        event.preventDefault()
    }

    const handleDelete = event => {
        const valueNew = value.filter(
            id => id !== event.target.id
        )
        data.set(props.name, valueNew)
        const itemsNew = items.filter(v =>
            v._id !== event.target.id
        )
        setItems(itemsNew)
    }

    const handleBlur = () => {
        setList([])
        setPrompt('')
    }

    useEffect(async () => {
        const value = data.get(props.name)
        if (!value || !value.length) return
        const itemsNew = await context.api.panel.get(props.path, {
            params: { _id: value, _compact: true }})
        setItems(itemsNew)
        setValue(value)
    }, [data.get(props.name)])

    useEffect(() => {
        if (props?.required) {
            ref.current.required = Array.isArray(items)
                && items.length ? false : true
        }
    }, [items])

    return (
        <Form.Group className={
            'autocomplete multiple dropdown ' + (props.className ?? '')          
        }>
            {props?.label && <Form.Label className="d-block">
                {props.label ?? 'Автозаповнення'}
            </Form.Label>}
            <div className="d-flex flex-wrap row-gap-3 column-gap-2">
                <div style={{ width: '120px' }}>
                    <Form.Control type="text" name="prompt" value={prompt} 
                        pattern={props.pattern ?? '.{1,10}'}
                        onChange={handleChange} onBlur={handleBlur}
                        title={props.title ?? 'Введіть символи для пошуку'}
                        autoComplete="off" ref={ref} />
                    {!!list.length && (
                        <ul className="dropdown-menu show">
                            {list.map(l => (
                                <li id={l._id} className="dropdown-item"
                                    onMouseDown={handleClick} key={l._id}>
                                    {l.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {items.map(item =>
                    <Button onClick={handleDelete} variant="outline-dark"
                        title="Видалити" id={item._id} key={item._id}>
                        {item.title}
                    </Button>
                )}
            </div>
        </Form.Group>
    )
    
}

Multiple.propTypes = {
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
    pattern: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool
}

export default Multiple