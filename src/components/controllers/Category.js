"use strict"

import React, { useState, useEffect } from "react"
import {
    useParams, useSearchParams, useNavigate, useOutletContext, generatePath
} from "react-router-dom"
import Form, { Image, Switch } from "../Form.js"

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
        context.setHeader('Категорії (cписок)', [
            { title: 'Створити', url: '/категорії/редактор' }
        ])
        setCategories({ items:
            await context.api.get('/категорії')
        })
    }, [searchParams])

    return (
        <div id="body" className="category view">
            <table className="table table-hover">
                <thead>
                    <tr className="text-center">
                        <th scope="col">#</th>
                        <th scope="col">Заголовок</th>
                        <th scope="col">Посилання</th>
                        <th scope="col">Сортування</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.items.map((category, index) => (
                        <tr key={category._id} role="button" onClick={() => handleClick(category._id)} className="text-center">
                            <th scope="row">{index + 1}</th>
                            <td>{category.title}</td>
                            <td>{category.alias}</td>
                            <td>{category.order}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function Editor() {

    const params = useParams()
    const [category, setCategory] = useState({
        time: new Date().toISOString(), title: '', description: '', 
        image: null, order: 0, status: false
    })
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
        await context.api.delete(['категорії', params.id])
        navigate('/категорії/список')
    }

    useEffect(async () => {
        context.setHeader('Категорії (редактор)', [
            { title: 'Закрити', url: '/категорії/список' }
        ])
        if (params?.id) {
            const category = await context.api.get(['категорії', params.id])
            if (!category) {
                return context.setMessage('Категорія не знайдена')
            }
            setCategory(category)
        }
    }, [])

    return (
        <div id="body" className="category edit">
            <Form setData={setCategory} onSave={handleSave} onDelete={handleDelete} id={category?._id}>
                <input type="datetime-local" name="time" value={category.time.slice(0, 16)} title="Час" />
                <input type="text" name="title" value={category.title} pattern=".*"
                    title="Заголовок" placeholder="Заголовок ..." required />
                <textarea name="description" value={category.description} pattern=".*" rows="3"
                    title="Опис" placeholder="Опис ..." />
                <Image name="image" value={category.image} title="Зображення" />
                <input type="number" name="order" value={category.order} min="1" max="99"
                    title="Сортування" />
                <Switch name="status" value={category.status} title="Статус" description="Видимість категорії" />
            </Form>
        </div>
     )
}


export default { Index, Editor }