import React, { useState, useEffect, useMemo, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Editor, { Reducer, actions} from '../../components/Editor.js'
import Form, { Field, Table, Row, Cell } from '../../components/Form.js'
import config from '../../config.js'

export default props => {

    const [post, setPost] = useState({})
    const [state, dispatch] = useReducer(Reducer, [{
        id: 0, type: 'main', title: 'Найменування'
    }])
    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const [slug, setSlug] = useState()
    const context = useOutletContext()

    const handleSubmit = async () => {
        const postNew = {
            ...post, title: state[0].title
        }
        if (state[0]?.image) {
            postNew.image = state[0].image
        } else {
            delete postNew.image
        }
        if (state.length > 1) {
            postNew.blocks = state.slice(1)
        } else {
            delete postNew.blocks
        }
        setPost(postNew)
        if (props?.id) {
            await context.api.panel.put('/posts/' + props.id, postNew)
            context.api.main.delete('/kesh/publikatsiyi/' + slug)
        } else {
            await context.api.panel.post('/posts', postNew)
        }
        props.onChange()
    }
/*
    const handleSubmit = async () => {
        props?.id
            ? await context.api.panel.put('/posts/' + props.id, post)
            : await context.api.panel.post('/posts', post)
        props.onChange()
    }
*/
    const handleDelete = async () => {
        await context.api.panel.delete('/posts/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        if (!props?.id) return
        const postNew = await context.api.panel.get('/posts/' + props.id)
        const blocks = [{ id: 0, type: 'main', title: postNew?.title }]
        if (postNew?.image) {
            blocks[0].image = postNew.image
        }
        if (postNew?.blocks) {
            blocks.push(...postNew.blocks)
        }
        dispatch(actions.load(blocks))
        setSlug(postNew.slug)
        setPost(postNew)
    }, [])

    useEffect(async () => {
        const categories = await context.api.panel.get('/categories')
        setCategories(categories)
        const types = await context.api.panel.get('/types')
        setTypes(types)
        /*
        props?.id
            ? setPost(await context.api.panel.get('/posts/' + props.id))
            : setPost(post => ({
                ...post,
                category: categories[0]._id,
                type: types[0]._id,
                user: context.user._id
            }))
        */
    }, [])

    const url = useMemo(() => (
        config.main.url + '/publikatsiyi/' + post.slug
    ), [post.slug])

    useEffect(() => console.log(post), [post])

    return (
        <Form data={post} show={props.show} onHide={props.onHide}
            onChange={setPost} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування публікації" fullscreen={true}>
            <Editor blocks={{ state, dispatch, actions }} />
            <Table size="medium">
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
                {/*
                <Row>
                    <Field.Title required
                        placeholder="Десь колись з кимось відбулась якась подія" />
                </Row>
                */}
                <Row>
                    <Field.Slug source={post?.title} required
                        placeholder="десь-колись-з-кимось-відбулась-якась-подія" />
                </Row>
                {/*<Row><Field.Image /></Row>*/}
                <Row>
                    <Field.Description placeholder="Опис сторінки" required />
                </Row>
                {/*<Row><Field.Body /></Row>*/}
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
                <Row>
                    <Field label="Адреса сторінки">
                        <a href={url + '?preview=true'} className='d-block'>{url}</a>
                    </Field>
                </Row>
            </Table>
        </Form>
    )
}