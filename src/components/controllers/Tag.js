"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../Form.js"

export function Index() {

    const [tags, setTags] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/мітки/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Мітки (cписок)',
            router: ['tag', 'index'],
            submenu: [
                { title: 'Створити', url: '/мітки/редактор' }
            ]
        })
        setTags({ items:
            await context.api.get('/мітки')
        })
    }, [searchParams])

    return (
        <div id="body" className="tag view">
            <table className="table table-hover">
                <thead>
                    <tr className="text-center">
                        <th scope="col">#</th>
                        <th scope="col">Заголовок</th>
                        <th scope="col">Посилання</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.items.map((tag, index) => (
                        <tr key={tag._id} role="button" onClick={() => handleClick(tag._id)}
                            className={'text-center' + (!tag.status ? ' text-muted' : '') }>
                            <th scope="row">{index + 1}</th>
                            <td>{tag.title}</td>
                            <td>{tag.alias}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function Editor() {

    const params = useParams()
    const [tag, setTag] = useState({
        title: '', description: '', image: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async () => {
        if (tag?._id) {
            await context.api.put(['мітки', params.id], tag)
        } else {
            await context.api.post('/мітки', tag)
        }
        navigate('/мітки/список')
    }

    const handleDelete = async () => {
        await context.api.delete(['мітки', params.id])
        navigate('/мітки/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Мітки (редактор)',
            router: ['tag', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/мітки/список' }
            ]
        })
        if (params?.id) {
            const tag = await context.api.get(['мітки', params.id])
            if (!tag) {
                return context.setMessage('Мітка не знайдена')
            }
            setTag(tag)
        }
    }, [])

    return (
        <Form setData={setTag} onSave={handleSave} onDelete={handleDelete} id={tag?._id}>
            <input type="text" name="title" value={tag.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={tag.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <Image name="image" value={tag.image} title="Зображення" />
            <Switch name="status" value={tag.status} title="Статус" description="Видимість мітки" />
        </Form>
     )
}

export default { Index, Editor }