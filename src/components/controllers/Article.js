"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Autocomplete, Switch } from "../Form.js"

export function Index() {

    const [articles, setArticles] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/статті/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Статті (cписок)',
            router: ['article', 'index'],
            submenu: [
                { title: 'Створити', url: '/статті/редактор' }
            ]
        })
        setArticles({ items:
            await context.api.get('/статті')
        })
    }, [searchParams])

    return (
        <table className="table table-hover">
            <thead>
                <tr className="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Автор</th>
                </tr>
            </thead>
            <tbody>
                {articles.items.map((article, index) => (
                    <tr key={article._id} role="button" onClick={() => handleClick(article._id)}
                        className={!article.status ? 'text-muted' : ''}>
                        <th scope="row">{index + 1}</th>
                        <td className="text-nowrap">{article.time.split('T')[0]}</td>
                        <td>{article.title}</td>
                        <td>{article.user}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export function Editor() {

    const params = useParams()
    const [article, setArticle] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const [categories, setCategories] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async data => {
        const articleExport = { ...article }
        if (articleExport?.tags) {
            articleExport.tags = articleExport.tags.map(tag => tag._id)
        }
        if (article?._id) {
            await context.api.put(['статті', params.id], articleExport)
        } else {
            await context.api.post('/статті', articleExport)
        }
        navigate('/статті/список')
    }

    const handleDelete = async () => {
        await context.api.delete(['статті', params.id])
        navigate('/статті/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Статті (редактор)',
            router: ['article', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/статті/список' }
            ]
        })
        const categories = await context.api.get('/категорії')
        setCategories(categories)
        if (params?.id) {
            const article = await context.api.get(['статті', params.id])
            if (!article) {
                return context.setMessage('Стаття не знайдена')
            }
            setArticle(article)
        } else {
            setArticle(article => ({ ...article, ...{ category: categories[0]._id } }))
        }
    }, [])

    return (
        <Form setData={setArticle} onSave={handleSave} onDelete={handleDelete} id={article?._id}>
            <input type="datetime-local" name="time" value={article.time.slice(0, 16)} title="Час" />
            <input type="text" name="title" value={article.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={article.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <textarea name="body" value={article.body} pattern=".*" rows="6"
                title="Текст" placeholder="Текст ..." />
            <Image name="image" value={article.image} title="Зображення" />
            <select name="category" value={article?.category} title="Категорія">
                {categories?.map(category => (
                    <option value={category._id} key={category._id}>{category.title}</option>
                ))}
            </select>
            <Autocomplete name="tags" value={article.tags} title="Мітки" api="/мітки/автозаповнення" />
            <Switch name="status" value={article.status} title="Статус" description="Видимість публікації" />
        </Form>
     )
}

export default {Index, Editor}