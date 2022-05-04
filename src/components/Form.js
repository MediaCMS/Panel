"use strict"

import React, { useState, useEffect } from "react"

export default function Form() {

    const [fields, setFields] = useState(props.fields)

    const handleChange = event => {
        console.log(event.target.name, event.target.value)
        setArticle(article => (
            { ...article, ...{ [event.target.name]: event.target.value }}
        ))
    }

    const handleSubmit = event => {
        console.log(event.target.name, event.target.value)
        props.submit(new FormData(event.target))
    }

    useEffect(async () => {
        console.log(fields)
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            {fields.map(field => (
                <div className="row my-3">
                    <div className="col-lg-2">
                        <label htmlFor="formControlTime" className="form-label">Дата</label>
                    </div>
                    <div className="col-lg-10">
                        <input type="datetime-local" name="time" value={item}
                            onChange={handleChange} className="form-control" id="formControlTime" />
                    </div>
                </div>
            ))}
        </form>
     )
}

function Field() {
    return <></>
}