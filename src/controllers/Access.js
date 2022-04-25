"use strict"

import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Buffer } from "buffer"
import MD5 from "crypto-js/md5.js"
import routes from "../routes.js"
import routesAPI from "../../routes.js"
import settings from "../settings.js"

export function Login(props) {

    const navigate = useNavigate()

    const handleLogin = async event => {
        event.preventDefault()
        const email = event.target.email.value
        const password = MD5(event.target.password.value).toString()
        const authorization = Buffer.from(`${email}:${password}`, 'utf8').toString('base64')
        const api = settings.api.url + routesAPI.User.uri + routesAPI.User.actions.login.uri
        try {
            const user = await props.api.get(api, { 
                headers: { 'Authorization': `Basic ${authorization}}` }
            })
            localStorage.setItem('user', JSON.stringify(user))
            // ToDo: props.setUser(user)
            navigate(routes.Article.uri, { replace: true })
        } catch (error) {
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

export function Logout(props) {
    const navigate = useNavigate()

    useEffect(async () => {
        await props.api.get(routesAPI.User.uri + routesAPI.User.actions.logout.uri)
        localStorage.removeItem('user')
        navigate(routes.Access.uri + '/' + routes.Access.actions.Login.alias, { replace: true })
    }, [])

    return null
}

export default { Login, Logout }