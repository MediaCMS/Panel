"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../Form.js"

export function Index() {

    const [roles, setRoles] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/ролі/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Ролі (cписок)',
            router: ['role', 'index'],
            submenu: [
                { title: 'Створити', url: '/ролі/редактор' }
            ]
        })
        setRoles({ items:
            await context.api.get('/ролі')
        })
    }, [searchParams])

    return (
        <table className="table table-hover">
            <thead>
                <tr className="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Рівень</th>
                </tr>
            </thead>
            <tbody>
                {roles.items.map((role, index) => (
                    <tr key={role._id} role="button" onClick={() => handleClick(role._id)}
                        className={'text-center' + (!role.status ? ' text-muted' : '') }>
                        <th scope="row">{index + 1}</th>
                        <td>{role.title}</td>
                        <td>{role.level}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export function Editor() {

    const params = useParams()
    const [role, setRole] = useState({
        title: '', description: '', image: null, level: 5, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async () => {
        if (role?._id) {
            await context.api.put(['ролі', params.id], role)
        } else {
            await context.api.post('/ролі', role)
        }
        navigate('/ролі/список')
    }

    const handleDelete = async () => {
        await context.api.delete(['ролі', params.id])
        navigate('/ролі/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Ролі (редактор)',
            router: ['role', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/ролі/список' }
            ]
        })
        if (!params?.id) return
        const role = await context.api.get(['ролі', params.id])
        if (!role) {
            return context.setMessage('Роль не знайдена')
        }
        setRole(role)
    }, [])

    return (
        <Form setData={setRole} onSave={handleSave} onDelete={handleDelete} id={role?._id}>
            <input type="text" name="title" value={role.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={role.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <Image name="image" value={role.image} title="Зображення" />
            <input type="number" name="level" value={role.level} min="1" max="5"
                title="Рівень" required />
            <Switch name="status" value={role.status} title="Статус" description="Видимість ролі" />
        </Form>
     )
}

export default { Index, Editor }