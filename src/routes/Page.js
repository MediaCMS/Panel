"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../../Form.js"
import Table from "../../Table.js"

export function Index() {

    const [pages, setPages] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/сторінки/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Сторінки (cписок)',
            router: ['page', 'index'],
            submenu: [
                { title: 'Створити', url: '/сторінки/редактор' }
            ]
        })
        setPages({ items:
            await context.api.get('/сторінки', { params: { 'сортування': 'title' } })
        })
    }, [searchParams])

    return (
        <Table className="mw-sm" onClick={handleClick}
            columns={[
                { title: 'Заголовок', class: 'text-center'},
                { title: 'Посилання', class: 'text-center'}
            ]} rows={pages.items.length ? pages.items.map(page => ({
                id: page._id, status: page.status, values: [page.title, page.alias]
            })) : []}
        />
    )
}

export function Editor() {

    const params = useParams()
    const [page, setPage] = useState({
        title: '', description: '', image: null, status: false
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async () => {
        if (page?._id) {
            await context.api.put(['сторінки', params.id], page)
        } else {
            await context.api.post('/сторінки', page)
        }
        navigate('/сторінки/список')
    }

    const handleDelete = async () => {
        if (page?.image) {
            return alert('Спершу видаліть фото')
        }
        await context.api.delete(['сторінки', params.id])
        navigate('/сторінки/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Сторінки (редактор)',
            router: ['page', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/сторінки/список' }
            ]
        })
        if (!params?.id) return
        const page = await context.api.get(['сторінки', params.id])
        if (!page) {
            return context.setMessage('Сторінка не знайдена')
        }
        setPage(pagePrev => ({ ...pagePrev, ...page }))
    }, [])

    return (
        <Form setData={setPage} onSave={handleSave} onDelete={handleDelete} id={page?._id}>
            <input type="text" name="title" value={page.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={page.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <textarea name="body" value={page.body} pattern=".*" rows="6"
                title="Текст" placeholder="Текст ..." />
            <Image name="image" value={page.image} title="Зображення" />
            <Switch name="status" value={page.status} title="Статус" description="Видимість сторінки" />
        </Form>
     )
}

export default { Index, Editor }