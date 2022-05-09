"use strict"

import React from "react"
import { useOutletContext } from "react-router-dom"
import axios from "axios"
import settings from "../settings.js"

export default function Form(props) {

    const handleChange = event => {
        setField(event.target.name, event.target.value)
    }

    const setField = async (name, value) => {
        await props.setData(data => (
            { ...data, ...{ [name]: value }}
        ))
    }

    const handleSubmit = event => {
        props.onSave(Object.fromEntries(new FormData(event.target)))
        event.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            {React.Children.map(props.children, (child, index) => {
                console.log(child)
                return (
                    <div className="row my-3">
                        <div className="col-lg-2">
                            <label htmlFor={'formControl' + index} className="form-label">{child.props.title}</label>
                        </div>
                        <div className="col-lg-10">
                            {React.cloneElement(child, {
                                onChange: (typeof props.type === 'string') ? handleChange : setField,
                                className: child.props?.className ? child.props.className : 'form-control',
                                id: 'formControl' + child.props.title[0].toUpperCase() + child.props.title.slice(1)
                            })}
                        </div>
                    </div>
                )
            })}
            <div className="text-center my-5">
                <button type="submit" className="btn btn-primary mx-1">Зберегти</button>
                {props?.id ? (
                    <button type="submit" onClick={props.onDelete} className="btn btn-danger mx-1">Видалити</button>
                ) : null}
            </div>
        </form>
    )
}

export function Image(props) {

    const handlUpload = async event => {
        console.log('Form.Image.handleChange.event.target.value', event.target.value)
        const formData = new FormData()
        formData.append('image', event.target.files[0])
        const response = await axios.post(settings.images.api, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log(response)
        props.onChange(props.name, response)
    }

    const handleDelete = async () => {
        console.log('Form.Image.handleDelete')
        const response = await axios.delete(settings.images.api + props.value)
        console.log(response)
        props.onChange(props.name, null)
    }

    return (
        <div id={props.id}>
            <input type="file" title={props.title} onChange={handlUpload}
                className={props.className} />
            (!props?.value ? (
                <img src={settings.images.url + props.value} />
            ) : (
                <button onClick={handleDelete} />
            ))
        </div>
        )
}

export function Autocomplete(props) {

    const [items, setItems] = useState()
    const context = useOutletContext()

    const handleChange = async event => {
        console.log('Form.Autocomplete.handleChange.event.target.value', event.target.value)
        const response = await context.api.get(props.api, {params: {query: event.target.value}})
        console.log(response)
        setItems(response)
    }

    const handleSelect = event => {
        console.log('Form.Autocomplete.handleSelect.event.target.value', event.target.value)
        props.onChange(props.name, {...props.value, ...{ [event.target.dataValue]: event.target.innerHTML}})
    }

    return (
        <div id={props.id}>
            <input type="text" onChange={handleChange} className={props.className} />
            (response ? (
                <datalist>
                    {items.map(item => (
                        <p dataValue={item._id} onClick={handleSelect}>{item.title}</p>
                    ))}
                </datalist>
            ) : null)
            (selected ? (
                <div>
                    {selected.map(item => {
                        const id = props.id + item._id
                        return (
                            <p>
                                <input type="checkbox" class="btn-check" id={id} autocomplete="off" />
                                <label class="btn btn-outline-primary" for={id} onClick={handleSelect}>
                                    {item.title}
                                </label>
                            </p>
                        )
                    })}
                </div>
            ) : null)
        </div>
    )
}