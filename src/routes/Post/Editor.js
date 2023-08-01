import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../wrappers/Form.js'

export default function () {

    const params = useParams()
    const [post, setPost] = useState({
        time: new Date().toISOString(), title: '', description: '', body: '',
        image: null, category: '', tags: null, status: false
    })
    const [categories, setCategories] = useState([])
    const context = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        const postExport = { ...post }
        if (postExport?.tags) {
            postExport.tags = postExport.tags.map(tag => tag._id)
        }
        /*
        postExport?._id
            ? await context.api.panel.put('/публікації/' + params.id, postExport)
            : await context.api.panel.post('/публікації', postExport)
        */
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
        const categories = await context.api.panel.get('/категорії')
        setCategories(categories)
        let postImport = {}
        if (params?.id) {
            postImport = await context.api.panel.get('/публікації/' + params.id)
        } else {
            postImport.category = categories[0]._id
        }
        setPost(postImport)
    }, [])

    return (
        <Form id={params.id} onChange={setPost} onSubmit={handleSubmit} onDelete={handleDelete}>
            <Row>
                <Cell sm="4">
                    <Field.DateTime value={post.time.slice(0, 16)} required />
                </Cell>
                <Cell sm="4">
                    <Field type="select" nmae="category" value={post.category} label="Категорія" required>
                        {categories.map(category => (
                            <option value={category._id} key={category._id}>{category.title}</option>
                        ))}
                    </Field>
                </Cell>
                <Cell sm="4">
                    <Field.Status value={post.status} label="Видимість публікації" />
                </Cell>
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.Title value={post.title} placeholder="Назва публікації" required />
                </Cell>
                <Cell sm="6">
                    <Field.Slug value={post.slug} placeholder="назва-публікації" required />
                </Cell>
            </Row>
            <Row><Field.Image value={post.image} /></Row>
            <Row>
                <Field.Description value={post.description} placeholder="Опис сторінки" required />
            </Row>
            <Row><Field.Body value={post.body} /></Row>
            <Row>
                <Field.Autocomplete name="tags" value={post.tags} label="Мітки"
                    path="/мітки/автозаповнення" multiple required />
            </Row>
        </Form>
     )
}