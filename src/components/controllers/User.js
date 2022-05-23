"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext
} from "react-router-dom"
import { Buffer } from "buffer"
import MD5 from "crypto-js/md5.js"
import settings from "../../settings.js"

export function Index(props) {
/*
    const [users, setUsers] = useState()

    useEffect(async () => {
        setUsers({ list:
            await props.api.get(routesAPI.User.uri)
        })
    }, [])

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {users?.list.map(user => (
                <div className="col" key={user._id}>
                    <Card
                        title={user.title}
                        description={user.description}
                        image={user.image}
                        uri={routes.User.uri + '/' + user.alias}
                    />
                </div>
            ))}
        </div>
    )
*/
    return null
}

export function Edit(props) {
/*
    const [articles, setArticles] = useState()
    const [searchParams] = useSearchParams()
    const params = useParams()

    useEffect(async () => {
        const user = await props.api.get([routesAPI.User.uri, params.alias])
        if (!user) {
            return props.setMessage('Автор не знайдений')
        }
        props.setTitle(user.title)
        setArticles({ list: 
            await props.api.get(routesAPI.Article.uri, { params: { 'автор': user._id } })
        })
    }, [searchParams])

    return (
        <>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {articles?.list.map(article => (
                    <div className="col" key={article._id}>
                        <Card
                            title={article.title}
                            description={article.description}
                            image={article.image}
                            uri={routes.Article.uri + '/' + article.alias}
                            button={{ title: article.category.title, uri: routes.Category.uri + '/' + article.category.alias }}
                        />
                    </div>
                ))}
            </div>
        </>
    )
    */
    return null
}

export function Login() {

    const navigate = useNavigate()
    const context = useOutletContext()

    const handleLogin = async event => {
        event.preventDefault()
        const email = event.target.email.value
        const password = MD5(event.target.password.value).toString()
        const authorization = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')
        try {
            const user = await context.api.get('/користувачі/вхід', { 
                headers: { 'Authorization': `Basic ${authorization}}` }
            })
            localStorage.setItem('user', JSON.stringify(user))
            navigate('/статті/список')
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                alert('Неправильний логін та пароль');
            } else {
                alert('Під час авторизації сталась невідома помилка');
            }
        }
    }

    return <main className="vh-100 d-flex">
        <div className="text-center m-auto">
            <img className="mb-4" src="/logo.png" alt="Медіа" />
            <form id="login" className="border p-3" style={{maxWidth:'480px'}} onSubmit={handleLogin}>
                <h1 className="h3 mb-3 fw-normal">Авторизуйтесь</h1>
                <div className="form-floating my-3">
                    <input type="email" name="email" className="form-control" id="email" placeholder="name@example.com" />
                    <label htmlFor="email">Поштова адреса</label>
                </div>
                <div className="form-floating my-3">
                    <input type="password" name="password" autoComplete="false" className="form-control" id="password" placeholder="Пароль" />
                    <label htmlFor="password">Пароль</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
            </form>
            <p className="mt-5 mb-3 text-muted">© {settings.copyright}</p>
        </div>
    </main>
}

export function Logout() {

    const navigate = useNavigate()
    const context = useOutletContext()

    useEffect(async () => {
        await context.api.get('/користувачі/вихід')
        localStorage.removeItem('user')
        navigate('/доступ/вхід')
    }, [])

    return null
}

export default { Index, Edit, Login, Logout }