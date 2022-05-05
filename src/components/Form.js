"use strict"

import React, { useEffect } from "react"

export default function Form(props) {

    const handleChange = event => {
        props.setData(data => (
            { ...data, ...{ [event.target.name]: event.target.value }}
        ))
    }

    const handleSubmit = event => {
        props.submit(new FormData(event.target))
    }

    useEffect(async () => {
        console.log('Form.useEffect', props)
    }, [])

    return (
        <form onSubmit={handleSubmit}>{React.Children.map(props.children, child => {
            const id = 'formControl' + child.props.name.charAt(0).toUpperCase() + child.props.name.slice(1)
            return (
                <div className="row my-3">
                    <div className="col-lg-2">
                        <label htmlFor={id} className="form-label">{child.props.title}</label>
                    </div>
                    <div className="col-lg-10">
                        {React.cloneElement(child, {
                            onChange: handleChange, className: 'form-control', id: id
                        })}
                    </div>
                </div>
            )
        })}</form>
    )
}