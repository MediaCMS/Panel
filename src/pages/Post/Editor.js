import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Editor, { Reducer, actions} from '../../components/Editor.js'
import Form, { Field, Table, Row, Cell } from '../../components/Form.js'
import config from '../../config.js'

const PostEditor = ({ id, show, onChange, onHide }) => {

    const context = useOutletContext()
    const [post, setPost] = useState({})
    const [state, dispatch] = useReducer(Reducer, [{
        id: 0, type: 'main', title: 'Найменування',
        user: context.user._id
    }])
    const [types, setTypes] = useState([])
    const [slug, setSlug] = useState()

    const handleSubmit = async () => {
        const postNew = { ...post,
            title: state[0].title,
            category: state[0].category
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
        console.log(postNew)
        if (id) {
            await context.api.panel.put('/posts/' + id, postNew)
            context.api.main.delete('/kesh/publikatsiyi/' + slug)
        } else {
            await context.api.panel.post('/posts', postNew)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/posts/' + id)
        onChange()
    }

    useEffect(() => {
        if (!id) return
        (async () => {
            const postNew = await context.api.panel.get('/posts/' + id)
            console.log(postNew)
            const blocks = [{
                id: 0, type: 'main', date: postNew.date, title: postNew?.title,
                category: postNew.category, user: postNew.user
            }]
            if (postNew?.image) {
                blocks[0].image = postNew.image
            }
            if (postNew?.blocks) {
                blocks.push(...postNew.blocks)
            }
            dispatch(actions.load(blocks))
            setSlug(postNew.slug)
            setPost(postNew)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const types = await context.api.panel.get('/types')
            setTypes(types)
        })()
    }, [])

    const url = useMemo(() => (
        config.main.url + '/publikatsiyi/' + post.slug
    ), [post.slug])

    useEffect(() => console.log(post), [post])

    return (
        <Form data={post} show={show} onHide={onHide}
            onChange={setPost} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування публікації" fullscreen={true}>
            <Editor blocks={{ state, dispatch, actions }} />
            <Table size="medium">
                <Row>
                    <Field.Description placeholder="Опис сторінки" required />
                </Row>
                <Row>
                    <Cell sm="5">
                        <Field.Slug source={post?.title} required
                            placeholder="десь-колись-з-кимось-відбулась-якась-подія" />
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