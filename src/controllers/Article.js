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
        setArticles({ list: await props.api.get(routesAPI.Article.uri) })
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
                    <tr key={article._id} onClick={() => navigate(routes.Article.uri + '/' + article._id)} role="button">
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
    const [article, setArticle] = useState({ title: '', description: '' })

    useEffect(async () => {
        const article = await props.api.get([routesAPI.Article.uri, params.id])
        console.log(article)
        if (!article) {
            return props.setMessage('Стаття не знайдена')
        }
        props.setTitle('Редагування')
        article.time = new Date(article.time)
        setArticle(article)
    }, [])

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="formControlTitle" className="form-label">Заголовок</label>
                <input type="text" name="title" value={article.title} className="form-control" id="formControlTitle" placeholder="Заголовок" />
            </div>
            <div className="mb-3">
                <label htmlFor="formControlDescription" className="form-label">Опис</label>
                <textarea name="description" className="form-control" id="formControlDescription" rows="3" placeholder="Опис">{article.description}</textarea>
            </div>
        {/*
            <p className="text-secondary small mt-1">
                <i>{
                    article.time.getDay() + ' ' +
                    settings.months[article.time.getMonth()] + ' ' +
                    article.time.getFullYear() + ' року  —  ' 
                }</i>
                <NavLink to={routes.User.uri + '/' + article.user.alias}>{article.user.title}</NavLink>
            </p>
            <p className="lead mt-4">{article.description}</p>
            {article?.image ? (
                <p>
                    <img src={settings.images.url + article.image} alt={article.title} className="w-100" />
                </p>
            ) : null}
            <div className="body" dangerouslySetInnerHTML={{ __html: article.body }}></div>
            {article?.tags ? (
                <p className="tags">
                    <strong>Мітки:&nbsp;</strong>
                    {article.tags.map((tag, index) => (
                        <NavLink to={routes.Tag.uri + '/' + tag.alias} key={index}>{tag.title}</NavLink>
                    ))}
                </p>
            ) : null}
         */}
        </form>
    )
}

export default {Index, Edit}