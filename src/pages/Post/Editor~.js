import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default props => {

    const [post, setPost] = useState({})
    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const context = useOutletContext()

    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/posts/' + props.id, post)
            : await context.api.panel.post('/posts', post)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/posts/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        const categories = await context.api.panel.get('/categories')
        setCategories(categories)
        const types = await context.api.panel.get('/types')
        setTypes(types)
        props?.id
            ? setPost(await context.api.panel.get('/posts/' + props.id))
            : setPost(post => ({
                ...post, 
                category: categories[0]._id,
                type: types[0]._id,
                user: context.user._id
            }))
    }, [])

    useEffect(() => console.log(post), [post])

    return (
        <Form data={post} show={props.show} onHide={props.onHide}
            onChange={setPost} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування публікації" fullscreen={false}>
            <Row>
                <Cell sm="5">
                    <Field.DateTime />
                </Cell>
                <Cell sm="4">
                    <Field type="select" name="category" label="Категорія">
                        {categories.map(category => (
                            <option value={category._id} key={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </Field>
                </Cell>
                <Cell sm="3">
                    <Field type="select" name="type" label="Тип">
                        {types.map(type => (
                            <option value={type._id} key={type._id}>
                                {type.title}
                            </option>
                        ))}
                    </Field>
                </Cell>
            </Row>
            <Row>
                <Field.Title required
                    placeholder="Десь колись з кимось відбулась якась подія" />
            </Row>
            <Row>
                <Field.Slug source={post?.title} required
                    placeholder="десь-колись-з-кимось-відбулась-якась-подія" />
            </Row>
            <Row><Field.Image /></Row>
            <Row>
                <Field.Description placeholder="Опис сторінки" required />
            </Row>
            <Row><Field.Body /></Row>
            <Row>
                <Field.Autocomplete name="tags" label="Мітки"
                    path="/tags" multiple required />
            </Row>
            <Row>
                <Cell sm="6">
                    <Field.Autocomplete name="user" label="Автор"
                        path="/users" required />
                </Cell>
                <Cell sm="6">
                    <Field.Status label="Видимість публікації" />
                </Cell>
            </Row>
        </Form>
    )
}