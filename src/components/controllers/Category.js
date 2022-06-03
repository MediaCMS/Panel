"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../Form.js"
import Table from "../Table.js"

export function Index() {

    const [categories, setCategories] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/категорії/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Категорії (cписок)',
            router: ['category', 'index'],
            submenu: [
                { title: 'Створити', url: '/категорії/редактор' }
            ]
        })
        setCategories({ items:
            await context.api.get('/категорії', { params: { 'сортування': 'order' } })
        })
    }, [searchParams])

    return (
        <Table className="mw-md" onClick={handleClick}
            columns={[
                { title: 'Заголовок', class: 'text-center'},
                { title: 'Посилання', class: 'text-center'},
                { title: 'Сортування', class: 'text-center'}
            ]} rows={categories.items.length ? categories.items.map(category => ({
                id: category._id, status: category.status,
                values: [category.title, category.alias, category.order]
            })) : []}
        />
    )
}

export function Editor() {

    const params = useParams()
    const [category, setCategory] = useState(
        { title: '', description: '', image: null, order: 0, status: false }
    )
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async () => {
        if (category?._id) {
            await context.api.put(['категорії', params.id], category)
        } else {
            await context.api.post('/категорії', category)
        }
        navigate('/категорії/список')
    }

    const handleDelete = async () => {
        if (category?.image) {
            return alert('Спершу видаліть фото')
        }
        await context.api.delete(['категорії', params.id])
        navigate('/категорії/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Категорії (редактор)',
            router: ['category', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/категорії/список' }
            ]
        })
        if (!params?.id) return
        const category = await context.api.get(['категорії', params.id])
        if (!category) {
            return context.setMessage('Категорія не знайдена')
        }
        setCategory(categoryPrev => ({ ...categoryPrev, ...category }))
    }, [])

    return (
        <Form setData={setCategory} onSave={handleSave} onDelete={handleDelete} id={category?._id}>
            <input type="text" name="title" value={category.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={category.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <Image name="image" value={category.image} title="Зображення" />
            <input type="number" name="order" value={category.order} min="1" max="99"
                title="Сортування" />
            <Switch name="status" value={category.status} title="Статус" description="Видимість категорії" />
        </Form>
     )
}


export default { Index, Editor }