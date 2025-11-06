import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Editor, { Reducer, actions} from '../../components/Editor.js'
import Form, { Field, Table, Row, Cell } from '../../components/Form.js'
import Main from './Editor/Main.js'
import config from '../../config.js'

const PostEditor = ({ id, show, onChange, onHide }) => {

    const context = useOutletContext()
    const [post, setPost] = useState({
        title: 'Заголовок', 
        date: new Date().toISOString(), 
        category: '61fae1bb6be8f90a409ecdd3',
        type: '64be89ff69a893de210bd7d4',
        user: context.user._id,
        status: false
    })
    const [state, dispatch] = useReducer(Reducer)
    const [types, setTypes] = useState([])
    const [slug, setSlug] = useState()

    const handleSubmit = async () => {
        let postNew = { ...post }
        if (state.length > 0) {
            postNew.blocks = state
        } else {
            delete postNew.blocks
        }
        setPost(postNew)
        console.log(postNew)
        if (id) {
            await context.api.panel.put('/posts/' + id, postNew)
            context.api.main.delete('/kesh/publikatsiyi/' + slug)
        } else {
            postNew = await context.api.panel.post('/posts', postNew)
            setPost(postNew)
            setSlug(postNew.slug)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/posts/' + id)
        context.api.main.delete('/kesh/publikatsiyi/' + slug)
        onChange()
    }

    useEffect(() => {
        (async () => {
            const postNew = id
                ? await context.api.panel.get('/posts/' + id)
                : post
            dispatch(
                actions.load(postNew.blocks)
            )
            setSlug(postNew.slug)
            setPost(postNew)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            setTypes(
                await context.api.panel.get('/types')
            )
        })()
    }, [])

    const url = useMemo(() => (
        config.main.url + '/publikatsiyi/' + post.slug
    ), [post.slug])

    return (
        <Form data={post} show={show} onHide={onHide}
            onChange={setPost} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування публікації" fullscreen={true}>
            <article itemScope="itemscope" itemType="https://schema.org/Article">
                <Main />
                <Editor blocks={{ state, dispatch, actions }} />
            </article>
            <Table size="medium">
                <Row>
                    <Cell sm="5">
                        <Field.Slug source={post.title} required
                            placeholder="zaholovok" />
                    </Cell>
                    <Cell sm="3">
                        <Field type="select" name="type" label="Тип" title="Тип публікації">
                            {types.map(type => (
                                <option value={type._id} key={type._id}>
                                    {type.title}
                                </option>
                            ))}
                        </Field>
                    </Cell>
                    <Cell sm="4">
                        <Field.Status label="Видимість публікації" />
                    </Cell>
                </Row>   
                <Row>
                    <Field.Autocomplete name="tags" label="Мітки"
                        path="/tags" multiple required />
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

PostEditor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default PostEditor