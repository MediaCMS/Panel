"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useOutletContext } from "react-router-dom"
import Form from "../../Form.js"

export default function Editor() {

    const params = useParams()
    const [article, setArticle] = useState({
        time: new Date().toISOString(), title: '', description: ''
    })
    const context = useOutletContext()

    const handleSave = data => {
        console.log('Editor.handleSave', data)
    }

    const handleDelete = () => {
        console.log('Editor.handleDelete', article._id)
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
            <Form setData={setArticle} onSave={handleSave} onDelete={handleDelete} id={article?._id}>
                <input type="datetime-local"
                    name="time"
                    value={article.time.slice(0, 16)}
                    title="Час" />
                <input type="text"
                    name="title"
                    value={article.title}
                    pattern=".*"
                    title="Заголовок"
                    placeholder="Заголовок статті ..." />
                <textarea name="description" 
                    value={article.description}
                    pattern=".*"
                    rows="3"
                    title="Опис"
                    placeholder="Опис статті ..." />
            </Form>
        </div>
     )
}