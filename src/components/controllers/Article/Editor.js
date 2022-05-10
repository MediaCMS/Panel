"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useOutletContext } from "react-router-dom"
import Form, { Image, Autocomplete } from "../../Form.js"

export default function Editor() {

    const params = useParams()
    const [article, setArticle] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: '', category: { _id: '' }, tags: null, status: false
    })
    const [categories, setCategories] = useState()
    const context = useOutletContext()

    const handleSave = data => {
        console.log('Editor.handleSave', data)
    }

    const handleDelete = () => {
        console.log('Editor.handleDelete', article._id)
    }

    useEffect(async () => {
        context.setTitle('Статті (редактор)')
        setCategories(await context.api.get('/категорії'))
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
                <input type="datetime-local" name="time" value={article.time.slice(0, 16)}
                    title="Час" className="form-control w-auto" />
                <input type="text" name="title" value={article.title} pattern=".*"
                    title="Заголовок" placeholder="Заголовок статті ..." />
                <textarea name="description" value={article.description} pattern=".*" rows="3"
                    title="Опис" placeholder="Опис статті ..." />
                <textarea name="body" value={article.body} pattern=".*" rows="6"
                    title="Текст" placeholder="Текст статті ..." />
                <Image name="image" value={article.image} title="Зображення" />
                <select name="category" value={article?.category?._id} title="Категорія"
                    className="form-select w-auto">
                    {categories?.map(category => (
                        <option value={category._id} key={category._id}>{category.title}</option>
                    ))}
                </select>
                <Autocomplete name="tags" value={article.tags} title="Мітки" />
            </Form>
        </div>
     )
}