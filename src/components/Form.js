"use strict"

import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import axios from "axios"
import settings from "../settings.js"

export default function Form(props) {
console.log('Form.props', props)
    const setField = async (name, value) => {
        console.log('Form.setField.name,value', name, value)
        await props.setData(data => (
            { ...data, ...{ [name]: value }}
        ))
    }

    const handleChange = event => {
        console.log('Form.handleChange.event.target', event.target)
        setField(event.target.name, event.target.value)
    }

    const handleSubmit = event => {
        props.onSave(Object.fromEntries(new FormData(event.target)))
        event.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            {React.Children.map(props.children, (child, index) => {
                //console.log('Form.child', child)
                return (
                    <div className="row my-3">
                        <div className="col-lg-2">
                            <label htmlFor={'formControl' + index} className="form-label">{child.props.title}</label>
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
                    <button type="submit" onClick={props.onDelete} className="btn btn-danger mx-1">Видалити</button>
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
            <input className="form-check-input" type="checkbox" id={props.id}
                checked={props?.value} onChange={handleChange} />
            <label className="form-check-label" htmlFor={props.id}>{props.description}</label>
        </div>
    )
        
}

export function Image(props) {
//console.log('Form.Image.props', props)
    const handlUpload = async event => {
        console.log('Form.Image.handlUpload.event.target.value', event.target.value)
        const formData = new FormData()
        formData.append('image', event.target.files[0])
        const response = await axios.post(settings.images.api, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('Form.Image.handlUpload.response', response)
        props.onChange(props.name, response)
    }

    const handleDelete = async () => {
        console.log('Form.Image.handleDelete')
        const response = await axios.delete(settings.images.api + props.value)
        console.log('Form.Image.handleDelete.response', response)
        props.onChange(props.name, null)
    }

    return (
        <div id={props.id} className="image">
            <input type="file" name={props.name} title={props.title}
                onChange={handlUpload} className={props.className} />
            {props?.value ? (
                <img src={settings.images.url + props.value} onClick={handleDelete}
                    title="Видалити" className="w-100 my-3" />
            ) : null}
        </div>
        )
}

export function Autocomplete(props) {
//console.log('Form.Autocomplete.props', props)
    const [items, setItems] = useState()
    const context = useOutletContext()
//console.log('Form.Autocomplete.items', items)
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
        <div id={props.id} className="autocomplete">
            <input type="text" onChange={handleChange} className={'d-inline-block me-2 ' + props.className} />
            {items ? (
                <datalist>
                    {items?.map(item => (
                        <p dataValue={item._id} onClick={handleSelect}>{item.title}</p>
                    ))}
                </datalist>
            ) : null}
            {props?.value ? 
                props.value.map(item => {
                    const id = props.id + item._id
                    return (
                        <span key={id} className="me-2">
                            <input type="checkbox" className="btn-check" id={id} autoComplete="off" />
                            <label className="btn btn-outline-success" htmlFor={id}
                                onClick={handleSelect} title="Видалити мітку">
                                {item.title}
                            </label>
                        </span>
                    )
                })
            : null}
        </div>
    )
}