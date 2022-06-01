"use strict"

import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import axios from "axios"
import settings from "../settings.js"

export default function (props) {

    const setField = async (name, value) => {
        await props.setData(data => (
            { ...data, ...{ [name]: value }}
        ))
    }

    const handleChange = event => {
        setField(event.target.name, event.target.value)
    }

    const handleSubmit = event => {
        props.onSave(Object.fromEntries(new FormData(event.target)))
        event.preventDefault()
    }

    const handleDelete = () => {
        if(window.confirm('Ви впевненні?')) {
            props.onDelete()
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {React.Children.map(props.children, (child, index) => {
                return (
                    <div className="row my-3">
                        <div className="col-lg-2">
                            <label htmlFor={'formControl' + index} className="form-label">
                                {child.props.title}
                            </label>
                        </div>
                        <div className="col-lg-10">
                            {React.cloneElement(child, {
                                onChange: (typeof child.type === 'string') ? handleChange : setField,
                                className: 'form-' + ((child.type === 'select') ? 'select' : 'control'),
                                id: 'formControl' + child.props.name[0].toUpperCase() + child.props.name.slice(1)
                            })}
                        </div>
                    </div>
                )
            })}
            <div className="text-center my-5">
                <button type="submit" className="btn btn-primary mx-1">Зберегти</button>
                {props?.id ? (
                    <button type="button" onClick={handleDelete} className="btn btn-danger mx-1">
                        Видалити
                    </button>
                ) : null}
            </div>
        </form>
    )
}

export function Switch(props) {

    const handleChange = async event => {
        props.onChange(props.name, event.target.checked)
    }

    return (
        <div className="form-check form-switch">
            <input type="checkbox" name={props.name} className="form-check-input"
                id={props.id} checked={props?.value} onChange={handleChange} />
            <label className="form-check-label" htmlFor={props.id}>{props.description}</label>
        </div>
    )
        
}

export function Image(props) {

    const handlUpload = async event => {
        const formData = new FormData()
        formData.append('image', event.target.files[0])
        const response = await axios.post(settings.images.api, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-api-key': settings.images.key
            }
        })
        if (response.status !== 200) {
            console.error(response)
            return alert('Під час збереження зображення виникла помилка')
        }
        props.onChange(props.name, response.data)
    }

    const handleDelete = async () => {
        const response = await axios.delete(
            settings.images.api + props.value.substr(7, 32),
            { headers: { 'x-api-key': settings.images.key } }
        )
        if (response.status !== 200) {
            console.error(response)
            return alert('Під час видалення зображення виникла помилка')
        }
        props.onChange(props.name, null)
    }

    return (<>
        {props?.value ? (
            <img src={settings.images.url + props.value} onClick={handleDelete}
                title="Видалити зображення" className="w-100 my-3" />
        ) : (
            <input type="file" name={props.name} title={props.title}
                onChange={handlUpload} className={props.className} />
        )}
    </>)
        
}

export function Autocomplete(props) {

    const [data, setData] = useState({ items: [] })
    const context = useOutletContext()

    const handleChange = async event => {
        setData({ items: [] })
        if (!event.target.value.length) return
        const params = { string: event.target.value }
        if (props?.value && props.value.length) {
            params.exclude = props.value.map(item => item._id).join(',')
        }
        const response = await context.api.get(props.api, { params: params })
        if (!response) return
        setData({ items: response })
    }

    const handleSelect = async event => {
        await props.onChange(props.name, [...(props.value ?? []), {
            _id: event.target.value, title: event.target.label
        }])
        setData(dataPrev => ({
            items: dataPrev.items.filter(item => item._id !== event.target.value)
        }))
    }

    const handleRemove = async event => {
        await props.onChange(props.name, props.value.filter(
            item => item._id !== event.target.dataset.id
        ))
    }

    return (
        <div id={props.id} className="autocomplete">
            <div className="d-inline-block me-2 position-relative">
                <input type="search" size="8" onChange={handleChange} className="form-control" />
                {data.items.length ? (
                    <select id={props.id + 'List'} className="form-select mt-1 position-absolute" multiple
                        size={(data.items.length > 1) ? ((data.items.length > 7) ? 7 : data.items.length) : 1}>
                        {data.items.map(item => (
                            <option value={item._id} onClick={handleSelect} key={item._id} label={item.title} />
                        ))}
                    </select>
                ) : null}
            </div>
            {(props?.value ?? []).map(item => {
                const id = props.id + item._id
                return (
                    <span key={id} className="m-1 d-inline-block">
                        <input type="checkbox" name={`${props.name}[${item._id}]`} className="btn-check" id={id} />
                        <label className="btn btn-outline-success" htmlFor={id}
                            onClick={handleRemove} title="Видалити мітку" data-id={item._id}>
                            {item.title}
                        </label>
                    </span>
                )
            })}
        </div>
    )
}