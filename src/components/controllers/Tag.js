"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../Form.js"
import Table from "../Table.js"

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
            await context.api.get('/мітки', { params: { 'сортування': 'title' } })
        })
    }, [searchParams])

    return (
        <Table className="mw-md" onClick={handleClick}
            columns={[
                { title: 'Заголовок', class: 'text-center'},
                { title: 'Посилання', class: 'text-center'}
            ]} rows={tags.items.length ? tags.items.map(tag => ({
                id: tag._id, status: tag.status, values: [tag.title, tag.alias]
            })) : []}
        />
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
        if (tag?.image) {
            return alert('Спершу видаліть фото')
        }
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
        if (!params?.id) return
        const tag = await context.api.get(['мітки', params.id])
        if (!tag) {
            return context.setMessage('Мітка не знайдена')
        }
        setTag(tagPrev => ({ ...tagPrev, ...tag }))
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