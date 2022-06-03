"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Autocomplete, Switch } from "../Form.js"
import Table from "../Table.js"

export function Index() {

    const [publications, setPublications] = useState({ items: [] })
    const [searchParams] = useSearchParams()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleClick = id => {
        navigate(
            generatePath(
                encodeURI('/публікації/редактор/:id'), { id: id }
            )
        )
    }

    useEffect(async () => {
        context.setParams({
            title: 'Публікації (cписок)',
            router: ['publication', 'index'],
            submenu: [
                { title: 'Створити', url: '/публікації/редактор' }
            ]
        })
        setPublications({
            items: await context.api.get('/публікації')
        })
    }, [searchParams])

    return (
        <Table onClick={handleClick}
            columns={[
                { title: 'Дата', class: 'text-nowrap'},
                { title: 'Заголовок', class: 'text-start' },
                { title: 'Автор', class: 'text-start' }
            ]} rows={publications.items.length ? publications.items.map(publication => ({
                id: publication._id, status: publication.status,
                values: [publication.time.split('T')[0], publication.title, publication.user]
            })) : []}
        />
    )
}

export function Editor() {

    const params = useParams()
    const [publication, setPublication] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '', 
        image: null, category: '', tags: null, status: false
    })
    const [categories, setCategories] = useState()
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSave = async data => {
        const publicationExport = { ...publication }
        if (publicationExport?.tags) {
            publicationExport.tags = publicationExport.tags.map(tag => tag._id)
        }
        if (publication?._id) {
            await context.api.put(['публікації', params.id], publicationExport)
        } else {
            await context.api.post('/публікації', publicationExport)
        }
        navigate('/публікації/список')
    }

    const handleDelete = async () => {
        if (publication?.image) {
            return alert('Спершу видаліть фото')
        }
        await context.api.delete(['публікації', params.id])
        navigate('/публікації/список')
    }

    useEffect(async () => {
        context.setParams({
            title: 'Публікації (редактор)',
            router: ['publication', 'editor'],
            submenu: [
                { title: 'Закрити', url: '/публікації/список' }
            ]
        })
        const categories = await context.api.get('/категорії')
        setCategories(categories)
        let publicationImport = []
        if (params?.id) {
            publicationImport = await context.api.get(['публікації', params.id])
            if (!publicationImport) {
                return context.setMessage('Публікація не знайдена')
            }
        } else {
            publicationImport = { category: categories[0]._id }
        }
        setArticle(publicationPrev => ({ ...publicationPrev, ...publicationImport }))
    }, [])

    return (
        <Form setData={setPublication} onSave={handleSave} onDelete={handleDelete} id={publication?._id}>
            <input type="datetime-local" name="time" value={publication.time.slice(0, 16)} title="Час" />
            <input type="text" name="title" value={publication.title} pattern=".*"
                title="Заголовок" placeholder="Заголовок ..." required />
            <textarea name="description" value={publication.description} pattern=".*" rows="3"
                title="Опис" placeholder="Опис ..." />
            <textarea name="body" value={publication.body} pattern=".*" rows="6"
                title="Текст" placeholder="Текст ..." />
            <Image name="image" value={publication.image} title="Зображення" />
            <select name="category" value={publication?.category} title="Категорія">
                {categories?.map(category => (
                    <option value={category._id} key={category._id}>{category.title}</option>
                ))}
            </select>
            <Autocomplete name="tags" value={publication.tags} title="Мітки" api="/мітки/автозаповнення" />
            <Switch name="status" value={publication.status} title="Статус" description="Видимість публікації" />
        </Form>
     )
}

export default {Index, Editor}