'use strict'

import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, generatePath } from 'react-router-dom'
import Table, { Row, Cell } from '../Table.js'
import Form, { Field } from '../Form.js'
import config from '../../config.js'

const uri = '/редактор/зображення'
const endpoint = '/зображення'

export function Index () {

    const [images, setImages] = useState([])
    const [filter, setFilter] = useState({ 
        title: '', author: '', source: '', post: '', sort: 'post:1', skip: 0, limit: 20
    })
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleEdit = id => {
        navigate(
            generatePath(':uri/редактор/:id', { uri, id })
        )
    }

    const handleSubmit = async () => {
        setImages(
            await context.api.get(endpoint, { params: filter })
        )
    }

    useEffect(async () => {
        context.setMeta(
            { title: 'Зображення / Cписок', router: 'images index', submenu: [
                { title: 'Створити', uri: uri + '/редактор' },
                { title: 'Фільтр', uri: '#filter', toggle: 'modal' }
            ]}
        )
        handleSubmit()
    }, [])

    return (<>
        {images.map(image => (
            <figure status={image.status.toString()} onClick={() => handleEdit(image._id)} key={image._id}>
                <img alt={image.title} title={image?.author ?? '' + '/' + image?.source ?? ''}
                    src={[config.image.uri, image._id[23], image._id[22], image._id[21], image._id, '320.jpg'].join('/')}
                        />
                <figcaption>
                    <h5>{image.post}</h5>
                    <p>{image.title}</p>
                </figcaption>
            </figure>
        ))}
        <Form type="filter" onChange={setFilter} onSubmit={handleSubmit}>
            <Field type="text" name="title" label="Назва" value={filter?.title} />
            <Field type="text" name="author" label="Автор" value={filter?.author} />
            <Field type="text" name="source" label="Джерело" value={filter?.source} />
            <Field type="text" name="post" label="Публікація" value={filter?.post} />
            <Field type="select" name="sort" label="Сортувати" value={filter?.sort}>
                <option value="post:1">За публікацією (зростання)</option>
                <option value="post:-1">За публікацією (спадання)</option>
            </Field>
        </Form>
    </>)
}
/*
export function Editor () {

    const [type, setType] = useState(
        { title: '', uri: '', sort: 1, status: false }
    )
    const context = useOutletContext()
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = async () => {
        params?.id 
            ? await context.api.put([endpoint, params.id], type)
            : await context.api.post(endpoint, type)
        navigate(uri + '/список')
    }

    const handleDelete = async () => {
        await context.api.delete([endpoint, params.id])
        navigate(uri + '/список')
    }

    useEffect(async () => {
        context.setMeta(
            { title: 'Типи / Редактор', router: 'types editor', submenu: [
                { title: 'Закрити', uri: uri + '/список' }
            ]}
        )
        if (params?.id) {
            setType(await context.api.get([endpoint, params.id]))
        }
    }, [])

    return (
        <Form id={params?.id} onSubmit={handleSubmit} onDelete={handleDelete} onChange={setType}>
            <Field type="text" name="title" value={type.title} placeholder="Місто" pattern=".{3,16}" required
                label="Назва" title="Найменування типу статті (від 3 до 16 симолів)" />
            <Field type="text" name="uri" value={type.uri} label="Посилання" disabled />
            <Field type="range" name="sort" value={type.sort} key={type.sort} min="1" max="10" step="1"
                label="Сортування" title="Порядоковий номер розташування в переліку" />
            <Field type="switch" name="status" value={type.status} label="Статус"
                title="Дозвіл на використання типу" />
       </Form>
    )
}
*/
export default {Index/*, Editor*/}

/*
export default function () {

    const context = useOutletContext()

    const handleSave = async event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('title', event.target.title.value)
        formData.append('file', event.target.image.files[0])
        console.log('Image.handleSave', await context.api.post(
            endpoint, formData, { timeout: 10_000 }
        ))
        alert(`Зображення збережено`)
    }

    const handleRemove = async event => {
        event.preventDefault()
        if (!confirm('Видалити зображення?')) return
        await context.api.delete(
            [endpoint, event.target.image.value],
            { timeout: 3_000 }
        )
        alert('Зображення видалено')
    }

    const handleSearch = async event => {
        event.preventDefault()
        const post = await context.api.get(
            [endpoint, 'знайти', event.target.image.value],
            { timeout: 5_000, output: 'json' }
        )
        if (post) {
            console.log(
                'Image.handleSearch', post, 
                window.location.origin + '/' + post.uri
            )
            alert('Зображення знайдено')
        } else {
            alert('Зображення не знайдено')
        }
    }

    const handleCheck = async () => {
        const images = await context.api.get(
            [endpoint, 'перевірити'], { timeout: 15_000, output: 'json' }
        )
        if (images.posts.length || images.files.length) {
            console.log('Image.handleCheck', images)
            alert('Виявлено проблеми')
        } else {
            alert('Проблем не виявлено')
        }
    }

    const handleThumbnails = async () => {
        console.log('Image.handleThumbnails', await context.api.get(
            [endpoint, 'мініатюри'], { timeout: 30_000 }
        ))
        alert('Мініатюри створено')
    }

    const handleResize = async event => {
        console.log('Image.handleResize', await context.api.get(
            [endpoint, 'зменшити'], { timeout: 120_000 })
        )
        alert('Розміри змінено')
    }

    useEffect(() => {
        context.setMeta(
            { title: 'Зображення', router: 'images', submenu: [
                {
                    title: 'Перевірити', 
                    description: 'Перевірити цілісність зображень', 
                    onClick: handleCheck,
                    confirm: true
                },
                {
                    title: 'Мініатюри',
                    description: 'Створити мініатюри зображень',
                    onClick: handleThumbnails,
                    confirm: true
                },
                {
                    title: 'Зменшити', 
                    description: 'Створити зменшені зображення',
                    onClick: handleResize,
                    confirm: true
                },
            ]}
        )
    }, [])

    return (
        <div className="box text-center">
            <form onSubmit={handleSave}>
                <div className="card upload my-5">
                    <div className="card-header">Збереження зображення</div>
                    <div className="card-body">
                        <p className="card-text m-4">
                            <input className="form-control m-2" type="text" name="title"
                                pattern='*{3,32}' placeholder="Заголовок зображення"
                                title="Від 3 до 32 символів" />
                            <input className="form-control m-2" type="file" name="image" required />
                        </p>
                        <button type="submit" className="btn btn-primary">Зберегти</button>
                    </div>
                </div>
            </form>
            <form onSubmit={handleRemove}>
                <div className="card remove my-5">
                    <div className="card-header">Видалення зображення</div>
                    <div className="card-body">
                        <p className="card-text m-4">
                            <input type="text" name="image" className="form-control" required
                                placeholder="Хеш зображення" pattern="[a-f0-9]{32}"
                                title="Рівно 32 латинські сивола та цифри" />
                        </p>
                        <button type="submit" className="btn btn-primary">Видалити</button>
                    </div>
                </div>
            </form>
            <form onSubmit={handleSearch}>
                <div className="card search my-5">
                    <div className="card-header">Пошук зображення в статтях</div>
                    <div className="card-body">
                        <p className="card-text m-4">
                            <input type="text" name="image" className="form-control" required 
                                placeholder="Хеш зображення" pattern="[a-f0-9]{32}"
                                title="Рівно 32 латинські сивола та цифри" />
                        </p>
                        <button type="submit" className="btn btn-primary">Знайти</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
*/