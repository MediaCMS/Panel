"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useOutletContext } from "react-router-dom"
import Form, { Image, Autocomplete, Switch } from "../../Form.js"

export default function Editor() {

    const params = useParams()
    const [article, setArticle] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const [categories, setCategories] = useState()
    const context = useOutletContext()

    const handleSave = async data => {
        console.log('article', article, data)
        const articleExport = { ...article }
        /*
        for (const [name, value] of Object.entries(article)) {
            if ([null, ""].indexOf(value) < 0) articleExport[name] = value
        }
        */
        if (articleExport?.tags) {
            articleExport.tags = articleExport.tags.map(tag => tag._id)
        }
        console.log('articleExport', articleExport)
        const response = article?._id
            ? await context.api.put(['статті', params.id], articleExport)
            : await context.api.post('/статті', articleExport)
        console.log('response', response)
    }

    const handleDelete = async () => {
        console.log('ArticleEditor.handleDelete', article._id)
        const response = await context.api.delete(['статті', params.id])
        console.log('ArticleEditor.handleDelete.response', response)
    }

    useEffect(async () => {
        context.setTitle('Статті (редактор)')
        const categories = await context.api.get('/категорії')
        setCategories(categories)
        if (!params?.id) {
            return setArticle(article => (
            { ...article, ...{ category: categories[0]._id } }
        ))
        }
        const article = await context.api.get(['статті', params.id])
        if (!article) {
            return context.setMessage('Стаття не знайдена')
        }
        setArticle(article)
    }, [])

    return (
        <div id="body" className="article edit">
            <Form setData={setArticle} onSave={handleSave} onDelete={handleDelete} id={article?._id}>
                <input type="datetime-local" name="time" value={article.time.slice(0, 16)} title="Час" />
                <input type="text" name="title" value={article.title} pattern=".*"
                    title="Заголовок" placeholder="Заголовок статті ..." required />
                <textarea name="description" value={article.description} pattern=".*" rows="3"
                    title="Опис" placeholder="Опис статті ..." />
                <textarea name="body" value={article.body} pattern=".*" rows="6"
                    title="Текст" placeholder="Текст статті ..." />
                <Image name="image" value={article.image} title="Зображення" />
                <select name="category" value={article?.category} title="Категорія">
                    {categories?.map(category => (
                        <option value={category._id} key={category._id}>{category.title}</option>
                    ))}
                </select>
                <Autocomplete name="tags" value={article.tags} title="Мітки" api="/мітки/автозаповнення" />
                <Switch name="status" value={article.status} title="Статус" description="Видимість публікації" />
            </Form>
        </div>
     )

}