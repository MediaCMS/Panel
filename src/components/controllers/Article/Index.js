"use strict"

import React, { useState, useEffect } from "react"
import {
    useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"

export default function Index() {

    const navigate = useNavigate()
    const [articles, setArticles] = useState()
    const [searchParams] = useSearchParams()
    const context = useOutletContext()

    useEffect(async () => {
        context.setHeader('Статті (cписок)', [
            { title: 'Створити', url: '/статті/редактор' }
        ])
        setArticles({ list: await context.api.get('/статті') })
    }, [searchParams])

    return (
        <div id="body" className="article view">
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
                            navigate(
                                generatePath(
                                    encodeURI('/статті/редактор/:id'), { id: article._id }
                                )
                            )}>
                            <th scope="row">{index + 1}</th>
                            <td className="text-nowrap">{article.time.split('T')[0]}</td>
                            <td>{article.title}</td>
                            <td>{article.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
