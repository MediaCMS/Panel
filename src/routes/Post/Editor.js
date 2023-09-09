import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const params = useParams()
    const [post, setPost] = useState({ tags: [] })
    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        const postExport = { ...post }
        postExport.time = new Date(postExport.time).toISOString()
        if (postExport?.tags) {
            postExport.tags = postExport.tags.map(tag => tag._id)
        }
        postExport?._id
            ? await context.api.panel.put('/posts/' + params.id, postExport)
            : await context.api.panel.post('/posts', postExport)
        navigate('/posts/list')
    }

    const handleDelete = async () => {
        if (post?.image) {
            //await context.api.image.delete(post?.image)
        }
        //await context.api.panel.delete('/posts/' + params.id)
        navigate('/posts/list')
    }

    useEffect(() => {
        context.init({
            title: 'Публікації / Редактор',
            submenu: [
                { title: 'Закрити', path: '/posts/list' }
            ]
        })
        if (params?.id) return
        setPost(post => ({ ...post, user: context.user._id }))
    }, [])

    useEffect(async () => {
        const categories = await context.api.panel.get('/categories')
        setCategories(categories)
        if (params?.id) return
        setPost(post => ({ ...post, category: categories[0]._id }))
    }, [])

    useEffect(async () => {
        const types = await context.api.panel.get('/types')
        setTypes(types)
        if (params?.id) return
        setPost(post => ({ ...post, type: types[0]._id }))
    }, [])

    useEffect(async () => {
        if (!params?.id) return
        const post = await context.api.panel.get('/posts/' + params.id)
        setPost(post)
    }, [])

    useEffect(async () => {
        console.log(post)
    }, [post])

    return (
        <Form data={post} onChange={setPost}
            onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="5">
                    <Field.DateTime />
                </Cell>
                <Cell sm="4">
                    <Field type="select" name="category" label="Категорія">
                        {categories.map(category => (
                            <option value={category._id} key={category._id}>{category.title}</option>
                        ))}
                    </Field>
                </Cell>
                <Cell sm="3">
                    <Field type="select" name="type" label="Тип">
                        {types.map(type => (
                            <option value={type._id} key={type._id}>{type.title}</option>
                        ))}
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Field.Title required
                    placeholder="Десь колись з кимось відбулась якась подія" />
            </Row>
            <Row>
                <Field.Slug source={post.title} required
                    placeholder="десь-колись-з-кимось-відбулась-якась-подія" />
            </Row>
            <Row><Field.Image /></Row>
            <Row>
                <Field.Description placeholder="Опис сторінки" required />
            </Row>
            <Row><Field.Body /></Row>
            <Row>
                <Field.Autocomplete name="tags" value={post.tags} label="Мітки"
                    path="/tags" multiple required />
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.Autocomplete name="user" value={post.user} label="Автор"
                        path="/users" required />
                </Cell>
                <Cell sm="6">
                    <Field.Status label="Видимість публікації" />
                </Cell>
            </Row>
        </Form>
     )
}