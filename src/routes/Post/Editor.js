import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const params = useParams()
    const [post, setPost] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '',
        image: null, category: '', tags: [], user: null, status: false
    })
    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        const postExport = { ...post }
        if (postExport?.tags) {
            postExport.tags = postExport.tags.map(tag => tag._id)
        }
        postExport?._id
            ? await context.api.panel.put('/публікації/' + params.id, postExport)
            : await context.api.panel.post('/публікації', postExport)
        navigate('/публікації/список')
    }

    const handleDelete = async () => {
        if (post?.image) {
            //await context.api.image.delete(post?.image)
        }
        //await context.api.panel.delete('/публікації/' + params.id)
        navigate('/публікації/список')
    }

    useEffect(async () => {
        context.init({
            title: 'Публікації / Редактор',
            submenu: [
                { title: 'Закрити', path: '/публікації/список' }
            ]
        })
        if (params?.id) return
        setPost(post => ({ ...post, user: context.user._id }))
    }, [])

    useEffect(async () => {
        const categories = await context.api.panel.get('/категорії')
        setCategories(categories)
        if (params?.id) return
        setPost(post => ({ ...post, category: categories[0]._id }))
    }, [])

    useEffect(async () => {
        const types = await context.api.panel.get('/типи')
        setTypes(types)
        if (params?.id) return
        setPost(post => ({ ...post, type: types[0]._id }))
    }, [])

    useEffect(async () => {
        if (!params?.id) return
        const post = await context.api.panel.get('/публікації/' + params.id)
        setPost(post)
    }, [])

    useEffect(async () => {
        console.log(post)
    }, [post])

    return (
        <Form id={params.id} onChange={setPost} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.DateTime value={post.time.slice(0, 16)} />
                </Cell>
                <Cell sm="4">
                    <Field type="select" name="category" value={post.category} label="Категорія">
                        {categories.map(category => (
                            <option value={category._id} key={category._id}>{category.title}</option>
                        ))}
                    </Field>
                </Cell>
                <Cell sm="4">
                    <Field type="select" name="type" value={post.type} label="Тип">
                        {types.map(type => (
                            <option value={type._id} key={type._id}>{type.title}</option>
                        ))}
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Field.Title value={post.title} required
                    placeholder="Десь колись з кимось відбулась якась подія" />
            </Row>
            <Row>
                <Field.Slug value={post.slug} required
                    placeholder="десь-колись-з-кимось-відбулась-якась-подія" />
            </Row>
            <Row><Field.Image value={post.image} /></Row>
            <Row>
                <Field.Description value={post.description} placeholder="Опис сторінки" required />
            </Row>
            <Row><Field.Body value={post.body} /></Row>
            <Row>
                <Field.Autocomplete name="tags" value={post.tags} label="Мітки"
                    path="/мітки" multiple required />
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.Autocomplete name="user" value={post.user} label="Автор"
                        path="/користувачі" required />
                </Cell>
                <Cell sm="6">
                    <Field.Status value={post.status} label="Видимість публікації" />
                </Cell>
            </Row>
        </Form>
     )
}