"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useOutletContext } from "react-router-dom"

export default function Editor() {

    const params = useParams()
    const [article, setArticle] = useState({
        time: new Date().toISOString(), title: '', description: ''
    })
    const context = useOutletContext()

    const handleChange = event => {
        console.log(event.target.name, event.target.value)
        setArticle(article => (
            { ...article, ...{ [event.target.name]: event.target.value }}
        ))
    }

    useEffect(async () => {
        context.setTitle('Статті (редактор)')
        if (!params?.id) return
        const article = await context.api.get(['статті', params.id])
        console.log(article)
        if (!article) {
            return context.setMessage('Стаття не знайдена')
        }
        setArticle(article)
    }, [])

    return (
        <div id="body" className="article edit">
            <form>
                <div className="row my-3">
                    <div className="col-lg-2">
                        <label htmlFor="formControlTime" className="form-label">Дата</label>
                    </div>
                    <div className="col-lg-10">
                        <input type="datetime-local" name="time" value={article.time.slice(0, 16)}
                            onChange={handleChange} className="form-control" id="formControlTime" />
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col-lg-2">
                        <label htmlFor="formControlTitle" className="form-label">Заголовок</label>
                    </div>
                    <div className="col-lg-10">
                        <input type="text" name="title" value={article.title} onChange={handleChange}
                            className="form-control" id="formControlTitle" placeholder="Заголовок статті ..." />
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col-lg-2">
                        <label htmlFor="formControlDescription" className="form-label">Опис</label>
                    </div>
                    <div className="col-lg-10">
                        <textarea name="description" className="form-control" onChange={handleChange}
                        id="formControlDescription" rows="3" placeholder="Опис статті ..." value={article.description} />
                    </div>
                </div>
            </form>
        </div>
     )
}