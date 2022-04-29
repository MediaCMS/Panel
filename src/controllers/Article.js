"use strict"

import React, { useState, useEffect } from "react"
import { NavLink, useParams, useSearchParams, useNavigate } from "react-router-dom"
import routes from "../routes.js"
import settings from "../settings.js"
import routesAPI from "../../routes.js"

export function Index(props) {

    const navigate = useNavigate()
    const [articles, setArticles] = useState()
    const [searchParams] = useSearchParams()

    useEffect(async () => {
        props.setTitle('Список')
        setArticles({ list: await props.api.get(routesAPI.Article.path) })
    }, [searchParams])

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Автор</th>
                </tr>
            </thead>
            <tbody>
                {articles?.list.map((article, index) => (
                    <tr key={article._id} role="button" onClick={() => 
                        navigate(routes.Article.path + '/' + routes.Article.actions.Edit.path + '/' + article._id)}>
                        <th scope="row">{index + 1}</th>
                        <td>{article.time.split('T')[0]}</td>
                        <td>{article.title}</td>
                        <td>{article.user}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export function Edit(props) {

    const params = useParams()
    const [article, setArticle] = useState({
        time: new Date().toISOString(), title: '', description: ''
    })

    const handleChangeTime = event => {
        console.log('Article.Edit.handleChangeTime', event.target.value, article.time.slice(0, 16))
        article.time = event.target.value
        setArticle(article)
        /*
        setArticle(article2 => {
            console.log(article2)
            article2.time = event.target.value
            console.log(article2)
            return article2
        })
        */
    }

    const handleChangeTitle = event => {
        console.log('Article.Edit.handleChangeTitle', event.target.value)
        article.title = event.target.value
        setArticle(article)
        /*
        setArticle(article2 => {
            console.log(article2)
            article2.title = event.target.value
            console.log(article2)
            return article2
        })
        */
   }

    const handleChangeDescription = () => {
        console.log('Article.Edit.handleChangeDescription')
    }

    useEffect(async () => {
        const article = await props.api.get([routesAPI.Article.path, params.id])
        console.log(article, article.time.slice(0, 16))
        if (!article) {
            return props.setMessage('Стаття не знайдена')
        }
        props.setTitle('Редагування')
        //article.time = new Date(article.time)
        setArticle(article)
    }, [])

    return (
        <form>
            <div className="row my-3">
                <div className="col-lg-2">
                    <label htmlFor="formControlTime" className="form-label">Дата</label>
                </div>
                <div className="col-lg-10">
                    <input type="datetime-local" name="time" value={article.time.slice(0, 16)}
                        onChange={handleChangeTime} className="form-control" id="formControlTime" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-lg-2">
                    <label htmlFor="formControlTitle" className="form-label">Заголовок</label>
                </div>
                <div className="col-lg-10">
                    <input type="text" name="title" value={article.title} onChange={handleChangeTitle}
                        className="form-control" id="formControlTitle" placeholder="Заголовок статті ..." />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-lg-2">
                    <label htmlFor="formControlDescription" className="form-label">Опис</label>
                </div>
                <div className="col-lg-10">
                    <textarea name="description" className="form-control" onChange={handleChangeDescription}
                    id="formControlDescription" rows="3" placeholder="Опис статті ..." defaultValue={article.description} />
                </div>
            </div>
        </form>
     )
}

export default {Index, Edit}