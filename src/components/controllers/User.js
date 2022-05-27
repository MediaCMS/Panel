"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../Form.js"
import { Buffer } from "buffer"
import MD5 from "crypto-js/md5.js"

export function Index() {

    const [users, setUsers] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/користувачі/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Користувачі (cписок)',
            router: ['user', 'index'],
            submenu: [
                { title: 'Створити', url: '/користувачі/редактор' }
            ]
        })
        setUsers({ items:
            await context.api.get('/користувачі')
        })
    }, [searchParams])

    return (
        <table className="table table-hover">
            <thead>
                <tr className="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Роль</th>
                </tr>
            </thead>
            <tbody>
                {users.items.map((user, index) => (
                    <tr key={user._id} role="button" onClick={() => handleClick(user._id)}
                        className={!user.status ? ' text-muted' : ''}>
                        <th scope="row" className="text-center">{index + 1}</th>
                        <td className="text-nowrap">{user.time.split('T')[0]}</td>
                        <td>{user.title}</td>
                        <td className="text-center">{user.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export function Editor() {

    const params = useParams()
    const [user, setUser] = useState({
        title: '', description: '', phone: '', skype: '', email: '',
        image: null, status: false
    })
    const [roles, setRoles] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async () => {
        const userExport = { ...user }
        if (userExport?.password) {
            if (!userExport?.password2) {
                return context.setMessage('Відсутній повторний пароль')
            }
            if (userExport.password !== userExport.password2) {
                return context.setMessage('Пароль відрізняється від повторного пароля')
            }
            userExport.password = MD5(userExport.password).toString()
        }
        if (userExport?._id) {
            await context.api.put(['користувачі', params.id], userExport)
        } else {
            await context.api.post('/користувачі', userExport)
        }
        setUser(user => { 
            delete user.password
            delete user.password2
            return user
        })
        navigate('/користувачі/список')
    }

    const handleDelete = async () => {
        await context.api.delete(['користувачі', params.id])
        navigate('/користувачі/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Користувачі (редактор)',
            router: ['user', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/користувачі/список' }
            ]
        })
        const roles = await context.api.get('/ролі')
        setRoles(roles)
        if (params?.id) {
            const user = await context.api.get(['користувачі', params.id])
            if (!user) {
                return context.setMessage('Користувач не знайдений')
            }
        } else {
            const user = { ...user, ...{ role: roles[5]._id } }
        }
        setUser(userPrev => ({ ...userPrev, ...user }))
    }, [])

    return (
        <Form setData={setUser} onSave={handleSave} onDelete={handleDelete} id={user?._id}>
            <input type="text" name="title" value={user.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={user.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <input type="text" name="phone" value={user.phone} pattern=".*"
                title="Телефон" placeholder="+380 67 123-45-67" />
            <input type="text" name="skype" value={user.skype} pattern=".*"
                title="Skype" placeholder="skype ..." required />
            <input type="email" name="email" value={user.email} pattern=".*"
                title="Пошта" placeholder="example@domain.com" required />
            <input type="password" name="password" pattern=".*{8,32}" title="Пароль" />
            <input type="password" name="password2" pattern=".*{8,32}" title="Пароль (повторно)" />
            <Image name="image" value={user.image} title="Зображення" />
            <select name="role" value={user?.role} title="Роль">
                {roles?.map(role => (
                    <option value={role._id} key={role._id}>{role.title}</option>
                ))}
            </select>
            <Switch name="status" value={user.status} title="Статус" description="Видимість користувача" />
        </Form>
     )
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

export default { Index, Editor, Login, Logout }