"use strict"

import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Buffer } from "buffer"
import MD5 from "crypto-js/md5.js"
import settings from "../settings.js"
import routes from "../routes.js"
import routesAPI from "../../routes.js"

export function Index(props) {

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
}

export function Edit(props) {

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
}

export function Login(props) {
    console.log('User.Login', props);

    const handleAuthorization = async event => {
        event.preventDefault()
        const email = event.target.email.value
        const password = MD5(event.target.password.value).toString()
        const authorization = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')
        const api = settings.api.url + routesAPI.User.uri + routesAPI.User.actions.login.uri
        console.log(email, password, api, authorization)
        const user = await fetch(api, { 
            headers: { 
                'Authorization': `Basic ${authorization }}`
            }
        })
        /*
        if (!user) {
            return props.setMessage('Автор не знайдений')
        }
        navigate(
            routes.Search.uri + '?запит=' + event.target.querySelector('input').value,
            { replace: true }
        );
        props.setTitle(user.title)
        setArticles({ list: 
            await props.api.get(routesAPI.Article.uri, { params: { 'автор': user._id } })
        })
        */
    }

    return <main className="vh-100 d-flex">
        <form id="login" className="p-3 m-auto border" style={{maxWidth:'480px'}} onSubmit={handleAuthorization}>
            <img className="mb-4" src="/logo.png" alt="" width="" />
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <div className="form-floating">
                <input type="email" name="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" name="password" className="form-control" id="floatingPassword" placeholder="Password" />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                </label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
            <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
        </form>
    </main>
}

export function Logout(props) {
    console.log('User.Logout', props);
    return <p>User.Logout</p>
}

export default { Index, Edit, Login, Logout }