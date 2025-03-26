import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Editor, { Reducer, actions} from '../../components/Editor.js'
import Form, { Field, Table, Row, Cell } from '../../components/Form.js'
import Main from './Editor/Main.js'
import config from '../../config.js'

const PageEditor = ({ id, show, onChange, onHide }) => {

    const [page, setPage] = useState({ title: '', description: '' })
    const [state, dispatch] = useReducer(Reducer, [])
    const [slug, setSlug] = useState()
    const context = useOutletContext()

    const handleSubmit = async () => {
        const pageNew = { ...page }
        if (state && state.length) {
            pageNew.blocks = state
        } else {
            delete pageNew.blocks
        }
        setPage(pageNew)
        console.debug(pageNew)
        if (page?._id) {
            await context.api.panel.put('/pages/' + page._id, pageNew)
            context.api.main.delete('/kesh/storinky/' + slug)
        } else {
            const _id = await context.api.panel.post('/pages', pageNew)
            setPage({ ...page, _id })
            setSlug(pageNew.slug)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/pages/' + page._id)
        context.api.main.delete('/kesh/storinky/' + slug)
        onChange()
    }

    useEffect(() => {
        (async () => {
            const pageNew = id
                ? await context.api.panel.get('/pages/' + id)
                : page
            dispatch(
                actions.load(pageNew.blocks)
            )
            console.debug(pageNew)
            setSlug(pageNew.slug)
            setPage(pageNew)
        })()
    }, [])

    const url = useMemo(() => (
        config.main.url + '/storinky/' + page.slug
    ), [page.slug])

    return (
        <Form data={page} show={show} onHide={onHide}
            onChange={setPage} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування сторінки" fullscreen={true}>
            <article itemScope="itemscope" itemType="https://schema.org/Article">
                <Main />
                <Editor blocks={{ state, dispatch, actions }} />
            </article>
            <Table size="medium">
                <Row>
                    <Cell sm="8">
                        <Field.Slug source={page.title} placeholder="pro-proyekt" required />
                    </Cell>
                    <Cell sm="4">
                        <Field.Status label="Видимість сторінки" />
                    </Cell>
                </Row>
                {page?.slug && 
                    <Row>
                        <Field label="Адреса сторінки">
                            <a href={url + '?preview=true'} className='d-block'>{url}</a>
                        </Field>
                    </Row>
                }
            </Table>
        </Form>
    )
}

PageEditor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default PageEditor