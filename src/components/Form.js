"use strict"

import React from "react"

export default function Form(props) {

    const handleChange = event => {
        props.setData(data => (
            { ...data, ...{ [event.target.name]: event.target.value }}
        ))
    }

    const handleSubmit = event => {
        props.onSave(Object.fromEntries(new FormData(event.target)))
        event.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            {React.Children.map(props.children, (child, index) => {
                return (
                    <div className="row my-3">
                        <div className="col-lg-2">
                            <label htmlFor={'formControl' + index} className="form-label">{child.props.title}</label>
                        </div>
                        <div className="col-lg-10">
                            {React.cloneElement(child, {
                                onChange: handleChange,
                                className: 'form-'
                                    + ((child.type === 'select') ? 'select' : 'control') 
                                    + (child.props?.className ? ' ' + child.props.className : ''),
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

    return <input type={props.type} name={props.name} value={props.value} title={props.title}
        onChange={props.onChange} className={props.className} id={props.id} />
}